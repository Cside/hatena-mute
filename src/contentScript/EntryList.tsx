/** @jsxImportSource jsx-dom */
import { STORAGE_KEY } from '../popup/constants';
import { storage } from '../storage';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import css from './dependsExtensionId.scss?inline';
import { $, $$ } from './utils';

const hasVisited = async (url: string) =>
  (await chrome.history.getVisits({ url })).length > 0;

type Entry = {
  element: HTMLElement;
  titleLink: HTMLAnchorElement;
  commentsLink: HTMLAnchorElement;
  description?: HTMLElement;
  domain: HTMLElement;
  hasVisited?: {
    entry: boolean;
    comments: boolean;
  };
};

// 3 種類のデザインの DOM アクセスを抽象化する処理だけ書く
// それ以外は entry.element.querySelector() で頑張る
const getEntries = ({
  selectors,
}: {
  selectors: {
    entry: string;
    titleLink: string;
    commentsLink: string;
    domain: string;
    description?: string;
  };
}) => {
  const entries: Entry[] = [];
  for (const entry of $$(selectors.entry)) {
    entries.push({
      element: entry,
      titleLink: $<HTMLAnchorElement>(entry, selectors.titleLink),
      commentsLink: $<HTMLAnchorElement>(entry, selectors.commentsLink),
      domain: $(entry, selectors.domain),
      ...(selectors.description
        ? { description: $(entry, selectors.description) }
        : {}),
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
          commentsLink:
            ':where(.entrylist-contents-users, .entrylist-contents-body) a',
          description: '.entrylist-contents-description',
          domain: '.entrylist-contents-domain a',
        },
      }),
      ...getEntries({
        selectors: {
          entry: '.entrylist-readlater-ranking-item',
          titleLink: '.entrylist-readlater-ranking-title a',
          commentsLink: 'a.entrylist-readlater-ranking-head',
          domain: '.entrylist-readlater-ranking-domain a',
        },
      }),
      ...getEntries({
        selectors: {
          entry: '.entrylist-3column-items > li',
          titleLink: '.entrylist-3column-title a',
          commentsLink: '.entrylist-3column-users a',
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
  async loadHistory() {}
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
      matchedClassName: 'hm-muted-sites-matched',
      match: (entry: Entry, muted: string) =>
        entry.titleLink.href.includes(muted),
    });
  }
  async filterByMutedWords() {
    await this.filterBy({
      storageKey: STORAGE_KEY.MUTED_WORDS,
      matchedClassName: 'hm-muted-words-matched',
      match: (entry: Entry, muted: string) =>
        !!entry.titleLink?.textContent?.includes(muted) ||
        !!entry.description?.textContent?.includes(muted),
    });
  }
  async muteSite(domain: string) {
    await storage.addLine(STORAGE_KEY.MUTED_SITES, domain);
    await this.filterBySites();
  }
  async appendMuteButtons() {
    const className = {
      button: 'hm-mute-button',
      muteSite: 'hm-mute-site',
      pulldown: 'hm-mute-pulldown',
      displayNone: 'hm-display-none',
    } as const;

    for (const entry of this.entries) {
      const muteButton = (
        <a
          href="#"
          className={className.button}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            pulldown.classList.toggle(className.displayNone);

            if (!pulldown.classList.contains(className.displayNone)) {
              const listener = (event: MouseEvent) => {
                if (
                  !(event.target as HTMLElement).closest(
                    '.' + className.pulldown,
                  )
                ) {
                  pulldown.classList.add(className.displayNone);
                  document.removeEventListener('click', listener);
                }
              };
              document.addEventListener('click', listener);
            }
          }}
        ></a>
      );
      entry.element.appendChild(muteButton);

      const domain = (entry.domain.textContent ?? '').trim();
      const pulldown = (
        <div
          className={`${className.pulldown} ${className.displayNone}`}
          style={{
            top: `${(muteButton as HTMLElement).offsetTop + 29}px`,
            left: `${(muteButton as HTMLElement).offsetLeft - 209}px`,
          }}
          onClick={() => this.muteSite(domain)}
        >
          <div className="mute-site">{domain} をミュートする</div>
          <div>この記事を非表示にする</div>
        </div>
      );
      entry.element.appendChild(pulldown);
    }
  }
}
