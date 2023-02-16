import { STORAGE_KEY } from '../popup/constants';
import { storage } from '../storage';

const $ = <T extends HTMLElement>(selector: string) =>
  document.querySelector<T>(selector);
const $$ = <T extends HTMLElement>(selector: string) => [
  ...document.querySelectorAll<T>(selector),
];

type Entry = {
  element: HTMLElement;
  title: string;
  url: string;
};

const getEntries = ({
  selectors,
}: {
  selectors: { entry: string; titleLink: string };
}) => {
  const entries: Entry[] = [];
  for (const entry of $$(selectors.entry)) {
    const link = entry.querySelector<HTMLAnchorElement>(selectors.titleLink);
    if (!link) {
      console.error(
        `title link (${selectors.titleLink}) is not found`,
        entry,
        entry.innerHTML,
      );
      continue;
    }
    entries.push({
      element: entry,
      title: link.textContent ?? '',
      url: link.href,
    });
  }
  return entries;
};

export class EntryList {
  entries: Entry[];

  constructor() {
    this.entries = [
      ...getEntries({
        selectors: {
          entry:
            ':where(.entrylist-header-main, .entrylist-item) > li:not(.entrylist-recommend)',
          titleLink: '.entrylist-contents-title a',
        },
      }),
      ...getEntries({
        selectors: {
          entry: '.entrylist-readlater-ranking-item',
          titleLink: '.entrylist-readlater-ranking-title a',
        },
      }),
      ...getEntries({
        selectors: {
          entry: '.entrylist-3column-items > li',
          titleLink: '.entrylist-3column-title a',
        },
      }),
    ];
  }
  private async filterBy({
    storageKey,
    matchClassName,
    matchTarget,
  }: {
    storageKey: StorageKey;
    matchClassName: string;
    matchTarget: (entry: Entry) => string;
  }) {
    const ngList = await storage.getLines(storageKey);

    for (const entry of this.entries) {
      if (ngList.some((ng) => matchTarget(entry).includes(ng))) {
        entry.element.classList.add(matchClassName);
        continue;
      }
      entry.element.classList.remove(matchClassName);
    }
  }
  async filterByUrls() {
    this.filterBy({
      storageKey: STORAGE_KEY.NG_URLS,
      matchClassName: 'ng-urls-matched',
      matchTarget: (entry: Entry) => entry.url,
    });
  }
  async filterByNgWords() {
    this.filterBy({
      storageKey: STORAGE_KEY.NG_WORDS,
      matchClassName: 'ng-words-matched',
      matchTarget: (entry: Entry) => entry.title,
    });
  }
  exists() {
    return !!$('.entrylist-wrapper');
  }
}
