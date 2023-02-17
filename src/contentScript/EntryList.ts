import { STORAGE_KEY } from '../popup/constants';
import { storage } from '../storage';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from './dependsExtensionId.scss?inline';
import { $, $$, createElementFromString } from './utils';

type Entry = {
  element: HTMLElement;
  title: string;
  url: string;
  domain: string;
};

// 3 種類の記事タイプの DOM アクセスを抽象化する処理だけ書く
// それ以外は entry.element で頑張る
const getEntries = ({
  selectors,
}: {
  selectors: {
    entry: string;
    titleLink: string;
    domain: string;
  };
}) => {
  const entries: Entry[] = [];
  for (const entry of $$(selectors.entry)) {
    const link = $<HTMLAnchorElement>(entry, selectors.titleLink);
    const domain = $(entry, selectors.domain);

    entries.push({
      element: entry,
      title: link.title,
      url: link.href,
      domain: (domain.textContent ?? '').trim(),
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
  exists() {
    return !!$('.entrylist-wrapper');
  }
  async filterByUrls() {
    await this.filterBy({
      storageKey: STORAGE_KEY.NG_URLS,
      matchClassName: 'ng-urls-matched',
      matchTarget: (entry: Entry) => entry.url,
    });
  }
  async filterByNgWords() {
    await this.filterBy({
      storageKey: STORAGE_KEY.NG_WORDS,
      matchClassName: 'ng-words-matched',
      matchTarget: (entry: Entry) => entry.title,
    });
  }
  async appendMuteButtons() {
    const className = {
      button: 'mute-button',
      pulldown: 'mute-pulldown',
      displayNone: 'display-none',
    } as const;

    for (const entry of this.entries) {
      // prettier-ignore
      const muteButton = createElementFromString(`
        <a
          href="#" class="${className.button}"
        >
        </a>
      `);
      entry.element.appendChild(muteButton);

      // prettier-ignore
      const pulldown = createElementFromString(`
        <div
          class="${className.pulldown} ${className.displayNone}"
          style="top: ${muteButton.offsetTop + 23}px; left: ${muteButton.offsetLeft-209}px"
        >
          <div>${entry.domain} を非表示にする</div>
          <div>この記事を非表示にする</div>
        </div>
      `);
      entry.element.appendChild(pulldown);
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
