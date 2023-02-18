/** @jsxImportSource jsx-dom */
import { STORAGE_KEY } from '../popup/constants';
import { storage } from '../storage';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from './dependsExtensionId.scss?inline';
import { $, $$, createElementFromString } from './utils';

type Entry = {
  element: HTMLElement;
  title: string;
  description?: string;
  url: string;
  domain: string;
};

// 3 種類のデザインの DOM アクセスを抽象化する処理だけ書く
// それ以外は entry.element.querySelector() で頑張る
const getEntries = ({
  selectors,
}: {
  selectors: {
    entry: string;
    titleLink: string;
    domain: string;
    description?: string;
  };
}) => {
  const entries: Entry[] = [];
  for (const entry of $$(selectors.entry)) {
    const link = $<HTMLAnchorElement>(entry, selectors.titleLink);
    const domain = $(entry, selectors.domain);
    if (domain.textContent === null) {
      throw new Error('domain.textContent is null');
    }
    let description: HTMLElement | undefined;
    if (selectors.description !== undefined) {
      description = $(entry, selectors.description);
    }
    if (description?.textContent === null) {
      throw new Error('description.textContent is null');
    }

    entries.push({
      element: entry,
      title: link.title,
      url: link.href,
      domain: domain.textContent.trim(),
      ...(description ? { description: description.textContent } : {}),
    });
  }
  return entries;
};

export class EntryList {
  entries: Entry[] = [];

  constructor() {
    this.entries = [
      ...getEntries({
        selectors: {
          entry:
            ':where(.entrylist-header-main, .entrylist-item) > li:not(.entrylist-recommend)',
          titleLink: '.entrylist-contents-title a',
          description: '.entrylist-contents-description',
          domain: '.entrylist-contents-domain a',
        },
      }),
      ...getEntries({
        selectors: {
          entry: '.entrylist-readlater-ranking-item',
          titleLink: '.entrylist-readlater-ranking-title a',
          domain: '.entrylist-readlater-ranking-domain a',
        },
      }),
      ...getEntries({
        selectors: {
          entry: '.entrylist-3column-items > li',
          titleLink: '.entrylist-3column-title a',
          domain: '.entrylist-3column-domain a',
        },
      }),
    ];
  }
  injectCss() {
    const style = document.createElement('style');
    style.appendChild(
      document.createTextNode(
        css.replaceAll('__MSG_@@extension_id__', chrome.runtime.id),
      ),
    );
    document.body.appendChild(style);
  }
  private async filterBy({
    storageKey,
    matchedClassName,
    match,
  }: {
    storageKey: StorageKey;
    matchedClassName: string;
    match: (entry: Entry, muted: string) => boolean;
  }) {
    const ngList = await storage.getLines(storageKey);

    for (const entry of this.entries) {
      if (ngList.some((muted) => match(entry, muted))) {
        entry.element.classList.add(matchedClassName);
        continue;
      }
      entry.element.classList.remove(matchedClassName);
    }
  }
  exists() {
    return !!$('.entrylist-wrapper');
  }
  async filterBySites() {
    await this.filterBy({
      storageKey: STORAGE_KEY.MUTED_SITES,
      matchedClassName: 'muted-sites-matched',
      match: (entry: Entry, muted: string) => entry.url.includes(muted),
    });
  }
  async muteSite(domain: string) {
    await storage.addLine(STORAGE_KEY.MUTED_SITES, domain);
  }
  async filterByMutedWords() {
    await this.filterBy({
      storageKey: STORAGE_KEY.MUTED_WORDS,
      matchedClassName: 'muted-words-matched',
      match: (entry: Entry, muted: string) =>
        entry.title.includes(muted) || !!entry.description?.includes(muted),
    });
  }
  async appendMuteButtons() {
    // TODO: これ CSS から取得できないの
    const className = {
      button: 'mute-button',
      muteSite: 'mute-site',
      pulldown: 'mute-pulldown',
      displayNone: 'display-none',
    } as const;

    for (const entry of this.entries) {
      // prettier-ignore
      const muteButton = createElementFromString(`
        <a href="#" class="${className.button}"></a>
      `);
      entry.element.appendChild(muteButton);

      // prettier-ignore
      const pulldown = createElementFromString(`
        <div
          class="${className.pulldown} ${className.displayNone}"
          style="top: ${muteButton.offsetTop + 29}px; left: ${muteButton.offsetLeft-209}px"
        >
          <div class="mute-site">${entry.domain} をミュートする</div>
          <div>この記事を非表示にする</div>
        </div>
      `);
      entry.element.appendChild(pulldown);

      pulldown.addEventListener('click', async () => {
        await this.muteSite(entry.domain);
      });

      muteButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        pulldown.classList.toggle(className.displayNone);

        if (!pulldown.classList.contains(className.displayNone)) {
          const listener = (event: MouseEvent) => {
            if (
              !(event.target as HTMLElement).closest('.' + className.pulldown)
            ) {
              pulldown.classList.add(className.displayNone);
              document.removeEventListener('click', listener);
            }
          };
          document.addEventListener('click', listener);
        }
      });
    }
  }
}
