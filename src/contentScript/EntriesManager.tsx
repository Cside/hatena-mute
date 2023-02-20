/** @jsxImportSource jsx-dom */
import { ACTION, STORAGE_KEY } from '../constants';
import { userOption } from '../userOption';
import { mutedList } from '../userOption/mutedList';
import { MuteButton } from './components/MuteButton';
import muteButtonStyles from './components/MuteButton/styles.module.scss';
import { MutePulldown } from './components/MutePulldown';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import iconCss from './icon.scss?inline';
import styles from './styles.module.scss';
import { $, $$ } from './utils';

type Entry = {
  element: HTMLElement;
  titleLink: HTMLAnchorElement;
  commentsLink: HTMLAnchorElement;
  description?: HTMLElement;
  domain: HTMLElement;
  hasVisited: {
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
      hasVisited: {
        entry: false,
        comments: false,
      },
    });
  }
  return entries;
};

export class EntriesManager {
  entries: Entry[] = [];

  root: HTMLElement | null;

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

    this.root = document.querySelector('.entrylist-wrapper');
  }
  async loadConfig() {
    if (!this.root) throw new Error(`this.root === null`);

    const lightensVisitedEntry = await userOption.get(
      STORAGE_KEY.LIGHTENS_VISITED_ENTRY,
    );
    const regardsEntryWhoseCommentsHaveBeenVisitedAsVisited =
      await userOption.get(
        STORAGE_KEY.REGARDS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED_AS_VISITED,
      );

    // FIXME: 下記の処理は独立してる必要があるので、切り離す。
    // lighten... > regards...
    if (lightensVisitedEntry) {
      this.root.classList.add(
        'lightens-visited-entry', // TODO: CSS Modules
      );
    } else if (regardsEntryWhoseCommentsHaveBeenVisitedAsVisited) {
      this.root.classList.add(
        'regards-entry-whose-comments-have-been-visited-as-visited', // TODO: CSS Modules
      );
    }
  }
  injectCss() {
    const style = document.createElement('style');
    style.appendChild(
      document.createTextNode(
        (iconCss as string)
          .replaceAll('__MSG_@@extension_id__', chrome.runtime.id)
          .replaceAll('mute-button', muteButtonStyles.muteButton),
      ),
    );
    document.body.appendChild(style);
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
      entry.hasVisited.entry = visitedMap[entry.titleLink.href];
      entry.hasVisited.comments = visitedMap[entry.commentsLink.href];
    }
  }
  // depends on loadHistory()
  lightenVisitedEntries() {
    for (const entry of this.entries) {
      entry.element.classList.add('visited', 'visited-comments'); // TODO: あとで css modules にする
    }
  }
  private async muteBy({
    storageKey,
    matchedClassName,
    match,
  }: {
    storageKey: MutedListsStorageKey;
    matchedClassName: string;
    match: (entry: Entry, muted: string) => boolean;
  }) {
    const list = await mutedList.getList(storageKey);

    for (const entry of this.entries) {
      if (list.some((muted) => match(entry, muted))) {
        entry.element.classList.add(matchedClassName);
        continue;
      }
      entry.element.classList.remove(matchedClassName);
    }
  }
  exists() {
    return !!this.root;
  }
  async muteBySites() {
    await this.muteBy({
      storageKey: STORAGE_KEY.MUTED_SITES,
      matchedClassName: styles.mutedSitesMatched,
      match: (entry: Entry, muted: string) =>
        entry.titleLink.href.includes(muted),
    });
  }
  async muteByMutedWords() {
    await this.muteBy({
      storageKey: STORAGE_KEY.MUTED_WORDS,
      matchedClassName: styles.mutedWordsMatched,
      match: (entry: Entry, muted: string) =>
        !!entry.titleLink?.textContent?.includes(muted) ||
        !!entry.description?.textContent?.includes(muted),
    });
  }
  async muteSite(domain: string) {
    await mutedList.addItem(STORAGE_KEY.MUTED_SITES, domain);
    await this.muteBySites();
  }
  async appendMuteButtons() {
    for (const entry of this.entries) {
      entry.element.appendChild(<MuteButton />);

      const domain = (entry.domain.textContent ?? '').trim();
      entry.element.appendChild(
        <MutePulldown domain={domain} onClick={() => this.muteSite(domain)} />,
      );
    }
  }
}
