/** @jsxImportSource jsx-dom */
import { ACTION, STORAGE_KEY } from '../../constants';
import { userOption } from '../../userOption';
import { MuteButton } from '../components/MuteButton';
import muteButtonStyles from '../components/MuteButton/styles.module.scss';
import { MutePulldown } from '../components/MutePulldown';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
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
      document.createTextNode(
        (iconCss as string)
          .replaceAll('__MSG_@@extension_id__', chrome.runtime.id)
          .replaceAll('mute-button', muteButtonStyles.muteButton),
      ),
    );
    document.body.appendChild(style);
  }

  private appendMuteButtons() {
    for (const entry of this.entries) {
      entry.element.appendChild(<MuteButton />);

      const domain = (entry.domain.textContent ?? '').trim();
      entry.element.appendChild(
        <MutePulldown
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
      if (list.some((muted) => match(entry, muted))) {
        entry.element.classList.add(matchedClassName);
        continue;
      }
      entry.element.classList.remove(matchedClassName);
    }
  }

  async muteBySites() {
    await this.muteBy({
      storageKey: STORAGE_KEY.MUTED_SITES,
      matchedClassName: styles.mutedSitesMatched,
      match: (entry: Entry, muted: string) =>
        entry.titleLink.href.includes(muted),
    });
  }

  async muteByWords() {
    await this.muteBy({
      storageKey: STORAGE_KEY.MUTED_WORDS,
      matchedClassName: styles.mutedWordsMatched,
      match: (entry: Entry, muted: string) =>
        !!entry.titleLink?.textContent?.includes(muted) ||
        !!entry.description?.textContent?.includes(muted),
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
    for (const entry of this.entries) {
      if (map.get(entry.titleLink.href))
        entry.element.classList.add(styles.mutedEntryMatched);
    }
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
