import { ACTION } from '../constants';
import { getEntries } from './entry';
import { EntryMuter } from './EntryMuter';
import './styles.module.scss';
import { VisitedEntryLightener } from './VisitedEntryLightener';

const rootElement = document.querySelector<HTMLElement>('.entrylist-wrapper');

if (rootElement) {
  const entries = getEntries();

  const entryMuterByList = new EntryMuter({ entries });
  const visitedEntryLightener = new VisitedEntryLightener({
    entries,
    rootElement,
  });

  chrome.runtime.onMessage.addListener(async ({ type }: { type: string }) => {
    console.info(`action: ${type}`);

    switch (type) {
      case ACTION.UPDATE_MUTED_SITES:
        await entryMuterByList.muteBySites();
        break;
      case ACTION.UPDATE_MUTED_WORDS:
        await entryMuterByList.muteByWords();
        break;
      case ACTION.UPDATE_LIGHTENING_OPTIONS:
        await visitedEntryLightener.lighten();
        break;

      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  });

  await entryMuterByList.mute();

  await visitedEntryLightener.lighten();

  // entryMuter.mute();
}
