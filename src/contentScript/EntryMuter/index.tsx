/** @jsxImportSource jsx-dom */
import type { Entry, StorageKey } from '../../types';

import { ACTION_OF, STORAGE_KEY_OF } from '../../constants';
import { sendMessageToBg } from '../../sendMessage';
import { storage } from '../../storage';
import { MuteButtonContainer } from '../components/MuteButtonContainer';
import { matchesLoosely, replaceUrlsInCss } from './utils';

import iconCss from './icon.pcss?inline';
import './styles.pcss';

export class EntryMuter {
  entries: Entry[] = [];

  constructor({ entries }: { entries: Entry[] }) {
    this.entries = entries;
  }

  initialize() {
    this.injectCss();
    this.appendMuteButtons();
  }

  private injectCss() {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(replaceUrlsInCss(iconCss as string)));
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
    const list = await storage.multiLineText.getAllLines(storageKey);

    for (const entry of this.entries) {
      entry.element.classList[list.some((muted) => match(entry, muted)) ? 'add' : 'remove'](
        matchedClassName,
      );
    }
  }

  async muteBySites() {
    await this.muteBy({
      storageKey: STORAGE_KEY_OF.MUTED_SITES,
      matchedClassName: 'hm-muted-sites-matched',
      match: (entry: Entry, muted: string) => matchesLoosely(entry.titleLink.href, muted),
    });
  }

  async muteByWords() {
    await this.muteBy({
      storageKey: STORAGE_KEY_OF.MUTED_WORDS,
      matchedClassName: 'hm-muted-words-matched',
      match: (entry: Entry, muted: string) =>
        !!matchesLoosely(entry.titleLink?.textContent || '', muted) ||
        !!matchesLoosely(entry.description?.textContent || '', muted),
    });
  }

  async muteByEntries() {
    const map: Map<string, boolean> = new Map(
      (await sendMessageToBg({
        type: ACTION_OF.GET_MUTED_ENTRY_MAP,
        payload: {
          urls: this.entries.map((entry) => entry.titleLink.href),
        },
      })) as [string, boolean][],
    );
    for (const entry of this.entries)
      entry.element.classList[map.get(entry.titleLink.href) ? 'add' : 'remove'](
        'hm-muted-entry-matched',
      );
  }

  async muteSite(domain: string) {
    await storage.multiLineText.appendLine(STORAGE_KEY_OF.MUTED_SITES, domain);
    await this.muteBySites();
  }

  async muteEntry(url: string) {
    await sendMessageToBg({
      type: ACTION_OF.ADD_MUTED_ENTRY,
      payload: { url },
    });
    await this.muteByEntries();
  }
}
