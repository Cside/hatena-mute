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
  async filterByNgWords() {
    const ngWords = await storage.getLines(STORAGE_KEY.NG_WORDS);
    if (!ngWords) return;

    this.entries = this.entries.filter((entry) => {
      if (ngWords.some((ngWord) => entry.title.includes(ngWord))) {
        entry.element.remove();
        return false;
      }
      return true;
    });
  }

  async filterByUrls() {
    const ngUrls = await storage.getLines(STORAGE_KEY.NG_URLS);
    if (!ngUrls) return;

    this.entries = this.entries.filter((entry) => {
      if (ngUrls.some((ngUrl) => entry.url.includes(ngUrl))) {
        entry.element.remove();
        return false;
      }
      return true;
    });
  }
  exists() {
    return !!$('.entrylist-wrapper');
  }
}
