import { ACTION, STORAGE_KEY } from '../constants';
import { userOption } from '../userOption';
import styles from './visitedEntryLightener.module.scss';

type ExtendedEntry = Entry & {
  commentsUrl: string;
};

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
      entry.titleLink.addEventListener('click', setVisited);
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

    if (this.options.lightensVisitedEntry) {
      this.rootElement.classList.add(styles.lightensVisitedEntry);
    } else {
      this.rootElement.classList.remove(styles.lightensVisitedEntry);
    }

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

      if (
        hasVisitedEntry ||
        (this.options.lightenEntryWhoseCommentsHaveBeenVisited &&
          hasVisitedComments)
      ) {
        entry.element.classList.add(styles.visited);
      } else {
        entry.element.classList.remove(styles.visited);
      }
    }
  }
}
