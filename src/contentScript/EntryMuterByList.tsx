/** @jsxImportSource jsx-dom */
import { STORAGE_KEY } from '../constants';
import { mutedList } from '../userOption/mutedList';
import { MuteButton } from './components/MuteButton';
import muteButtonStyles from './components/MuteButton/styles.module.scss';
import { MutePulldown } from './components/MutePulldown';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import iconCss from './icon.scss?inline';
import styles from './styles.module.scss';

export class EntryMuterByList {
  entries: Entry[] = [];

  constructor({ entries }: { entries: Entry[] }) {
    this.entries = entries;

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
        <MutePulldown domain={domain} onClick={() => this.muteSite(domain)} />,
      );
    }
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
    const list = await mutedList.getList(storageKey);

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
}
