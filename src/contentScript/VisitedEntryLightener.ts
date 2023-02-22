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
    if (await userOption.get(STORAGE_KEY.LIGHTENS_VISITED_ENTRY))
      this.rootElement.classList.add(styles.lightensVisitedEntry);

    const regardsEntryWhoseCommentsHaveBeenVisitedAsVisited =
      await userOption.get(
        STORAGE_KEY.REGARDS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED_AS_VISITED,
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
        (regardsEntryWhoseCommentsHaveBeenVisitedAsVisited &&
          hasVisitedComments)
      )
        entry.element.classList.add(styles.visited);
    }
  }
}
