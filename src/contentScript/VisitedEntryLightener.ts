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

  async initialize() {
    this.visitedMap = await chrome.runtime.sendMessage({
      type: ACTION.GET_VISITED_MAP,
      payload: {
        urls: this.entries
          .map((entry) => [entry.titleLink.href, entry.commentsUrl])
          .flat(),
      },
    });
  }

  async lighten() {
    if (await userOption.get(STORAGE_KEY.LIGHTENS_VISITED_ENTRY)) {
      this.rootElement.classList.add(styles.lightensVisitedEntry);
    } else {
      this.rootElement.classList.remove(styles.lightensVisitedEntry);
    }

    const lightenEntryWhoseCommentsHaveBeenVisited = await userOption.get(
      STORAGE_KEY.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED,
    );

    for (const entry of this.entries) {
      const hasVisitedEntry = this.visitedMap[entry.titleLink.href];
      const hasVisitedComments = this.visitedMap[entry.commentsUrl];

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
        (lightenEntryWhoseCommentsHaveBeenVisited && hasVisitedComments)
      ) {
        entry.element.classList.add(styles.visited);
      } else {
        entry.element.classList.remove(styles.visited);
      }
    }
  }
}
