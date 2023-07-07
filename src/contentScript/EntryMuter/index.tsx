/** @jsxImportSource jsx-dom */
import type { Entry, StorageKey } from '../../types';

import { ACTION, STORAGE_KEY } from '../../constants';
import { userOption } from '../../userOption';
import { MuteButtonContainer } from '../components/MuteButtonContainer';
import { matchesLoosely, replaceCssUrls } from './utils';

import iconCss from './icon.scss?inline';
import styles from './styles.module.scss';

export class EntryMuter {
  entries: Entry[] = [];

  constructor({ entries }: { entries: Entry[] }) {
    this.entries = entries;
  }

  async initialize() {
    this.injectCss();
    this.appendMuteButtons();
  }

  private injectCss() {
    const style = document.createElement('style');
    style.appendChild(
      document.createTextNode(replaceCssUrls(iconCss as string)),
    );
    document.body.appendChild(style);
  }

  private appendMuteButtons() {
    for (const entry of this.entries) {
      const domain = (entry.domain.textContent ?? '').trim();
      entry.element.appendChild(
        <MuteButtonContainer
          domain={domain}
          muteSite={(domain: string) => this.muteSite(domain)}
          muteEntry={() => this.muteEntry(entry.titleLink.href)}
        />,
      );
    }
  }

  async mute() {
    await this.muteBySites();
    await this.muteByWords();
    // sendMessage が返ってこなくてエラーになるケースがあるので、一番最後でなければならない
    await this.muteByEntries();
  }

  private async muteBy({
    storageKey,
    matchedClassName,
    match,
  }: {
    storageKey: StorageKey;
    matchedClassName: string;
    match: (entry: Entry, muted: string) => boolean;
  }) {
    const list = await userOption.text.getLines(storageKey);

    for (const entry of this.entries) {
      entry.element.classList[
        list.some((muted) => match(entry, muted)) ? 'add' : 'remove'
      ](matchedClassName);
    }
  }

  async muteBySites() {
    await this.muteBy({
      storageKey: STORAGE_KEY.MUTED_SITES,
      matchedClassName: styles.mutedSitesMatched,
      match: (entry: Entry, muted: string) =>
        matchesLoosely(entry.titleLink.href, muted),
    });
  }

  async muteByWords() {
    await this.muteBy({
      storageKey: STORAGE_KEY.MUTED_WORDS,
      matchedClassName: styles.mutedWordsMatched,
      match: (entry: Entry, muted: string) =>
        !!matchesLoosely(entry.titleLink?.textContent || '', muted) ||
        !!matchesLoosely(entry.description?.textContent || '', muted),
    });
  }

  async muteByEntries() {
    const map: Map<string, boolean> = new Map(
      await chrome.runtime.sendMessage({
        type: ACTION.GET_MUTED_ENTRY_MAP,
        payload: {
          urls: this.entries.map((entry) => entry.titleLink.href),
        },
      }),
    );
    for (const entry of this.entries)
      entry.element.classList[map.get(entry.titleLink.href) ? 'add' : 'remove'](
        styles.mutedEntryMatched,
      );
  }

  async muteSite(domain: string) {
    await userOption.text.appendLine(STORAGE_KEY.MUTED_SITES, domain);
    await this.muteBySites();
  }

  async muteEntry(url: string) {
    await chrome.runtime.sendMessage({
      type: ACTION.ADD_MUTED_ENTRY,
      payload: { url },
    });
    await this.muteByEntries();
  }
}
