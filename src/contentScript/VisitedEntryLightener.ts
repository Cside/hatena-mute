import { ACTION, STORAGE_KEY } from '../constants';
import { userOption } from '../userOption';
import styles from './visitedEntryLightener.module.scss';

export class VisitedEntryLightener {
  entries: Entry[] = [];
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
    this.entries = entries;
    this.rootElement = rootElement;
  }

  async initialize() {
    this.visitedMap = await chrome.runtime.sendMessage({
      type: ACTION.GET_VISITED_MAP,
      payload: {
        urls: this.entries
          .map((entry) => [entry.titleLink.href, entry.commentsLink.href])
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
      const hasVisitedComments = this.visitedMap[entry.commentsLink.href];

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
