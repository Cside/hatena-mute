import { ACTION, STORAGE_KEY } from '../../constants';
import type { Entry } from '../../types';
import { userOption } from '../../userOption';
import styles from './styles.module.scss';

type ExtendedEntry = Entry & {
  commentsUrl: string;
};

const GA_PARAM = '_gl';

export class VisitedEntryLightener {
  entries: ExtendedEntry[] = [];
  rootElement: HTMLElement;

  visitedMap: {
    [k: string]: boolean;
  } = {};

  options: {
    lightensVisitedEntry: boolean;
    lightenEntryWhoseCommentsHaveBeenVisited: boolean;
  } = {
    lightensVisitedEntry: false,
    lightenEntryWhoseCommentsHaveBeenVisited: false,
  };

  constructor({
    entries,
    rootElement,
  }: {
    entries: Entry[];
    rootElement: HTMLElement;
  }) {
    for (const entry of entries) {
      const commentsUrl = entry.commentsLinks[0]?.href;
      if (!commentsUrl) throw new Error(`entry.commentsLinks === 0`);
      this.entries.push({
        ...entry,
        commentsUrl,
      });
    }
    this.rootElement = rootElement;
  }

  addClickListeners() {
    for (const entry of this.entries) {
      const setVisited = () => entry.element.classList.add(styles.visited);
      entry.titleLink.addEventListener('click', async (event) => {
        if (!(event.target instanceof HTMLAnchorElement))
          throw new TypeError(`event.target is not HTMLAnchorElement`);

        const url = new URL(event.target.href);
        if (url.searchParams.has(GA_PARAM)) {
          url.searchParams.delete(GA_PARAM);
          await chrome.runtime.sendMessage({
            type: ACTION.ADD_HISTORY,
            payload: { url: url.toString() },
          });
        }
        setVisited();
      });
      for (const commentsLink of entry.commentsLinks) {
        commentsLink.addEventListener('click', () => {
          if (this.options.lightenEntryWhoseCommentsHaveBeenVisited)
            setVisited();
        });
      }
    }
  }

  private async setOptions() {
    this.options = {
      lightensVisitedEntry: await userOption.get(
        STORAGE_KEY.LIGHTENS_VISITED_ENTRY,
      ),
      lightenEntryWhoseCommentsHaveBeenVisited: await userOption.get(
        STORAGE_KEY.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED,
      ),
    };
  }

  async lighten() {
    await this.setOptions();

    // コンストラクタでやると、再呼び出しされたときに、
    // バックグランドで開いた URL の .visited がリセットされてしまうため、都度呼ぶ
    const visitedMap: Map<string, boolean> = new Map(
      await chrome.runtime.sendMessage({
        type: ACTION.GET_VISITED_MAP,
        payload: {
          urls: this.entries
            .map((entry) => [entry.titleLink.href, entry.commentsUrl])
            .flat(),
        },
      }),
    );

    this.rootElement.classList[
      this.options.lightensVisitedEntry ? 'add' : 'remove'
    ](styles.lightensVisitedEntry);

    for (const entry of this.entries) {
      const hasVisitedEntry = visitedMap.get(entry.titleLink.href);
      const hasVisitedComments = visitedMap.get(entry.commentsUrl);

      if (hasVisitedEntry === undefined)
        throw new Error(
          `key (${entry.titleLink.href}) doesn't exist in visitedMap`,
        );
      if (hasVisitedComments === undefined)
        throw new Error(
          `key (${entry.titleLink.href}) doesn't exist in visitedMap`,
        );

      entry.element.classList[
        hasVisitedEntry ||
        (this.options.lightenEntryWhoseCommentsHaveBeenVisited &&
          hasVisitedComments)
          ? 'add'
          : 'remove'
      ](styles.visited);
    }
  }
}
