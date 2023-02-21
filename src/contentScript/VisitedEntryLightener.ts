import { ACTION, STORAGE_KEY } from '../constants';
import { userOption } from '../userOption';
import styles from './visitedEntryLightener.module.scss';

export class VisitedEntryLightener {
  entries: Entry[] = [];
  rootElement: HTMLElement;

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
    await this.loadHistory();
  }

  async loadHistory() {
    const visitedMap = await chrome.runtime.sendMessage({
      type: ACTION.GET_VISITED_MAP,
      payload: {
        urls: this.entries
          .map((entry) => [entry.titleLink.href, entry.commentsLink.href])
          .flat(),
      },
    });
    for (const entry of this.entries) {
      if (!Object.hasOwn(visitedMap, entry.titleLink.href))
        throw new Error(
          `url (${entry.titleLink.href}) doesn't exist in visitedMap`,
        );
      if (visitedMap[entry.titleLink.href]) entry.element.classList.add(styles);

      if (!Object.hasOwn(visitedMap, entry.commentsLink.href))
        throw new Error(
          `url (${entry.titleLink.href}) doesn't exist in visitedMap`,
        );
      if (visitedMap[entry.commentsLink.href])
        entry.element.classList.add('comments-visited'); // TODO: CSS Modules
    }
  }

  async mute() {
    if (await userOption.get(STORAGE_KEY.LIGHTENS_VISITED_ENTRY))
      this.rootElement.classList.add(
        'lightens-visited-entry', // TODO: CSS Modules
      );
    if (
      await userOption.get(
        STORAGE_KEY.REGARDS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED_AS_VISITED,
      )
    )
      this.rootElement.classList.add(
        'regards-entry-whose-comments-have-been-visited-as-visited', // TODO: CSS Modules
      );
  }
}
