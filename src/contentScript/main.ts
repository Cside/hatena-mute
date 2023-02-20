import { ACTION } from '../constants';
import { getEntries } from './entry';
import { EntryMuterByList } from './EntryMuterByList';
import './styles.module.scss';
import { VisitedEntryLightener } from './VisitedEntryLightener';

const rootElement = document.querySelector<HTMLElement>('.entrylist-wrapper');

if (rootElement) {
  const entries = getEntries();

  const entryMuterByList = new EntryMuterByList({ entries });

  chrome.runtime.onMessage.addListener(async ({ type }: { type: string }) => {
    switch (type) {
      case ACTION.UPDATE_MUTED_SITES:
        await entryMuterByList.muteBySites();
        break;
      case ACTION.UPDATE_MUTED_WORDS:
        await entryMuterByList.muteByMutedWords();
        break;

      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  });

  await entryMuterByList.muteBySites();
  await entryMuterByList.muteByMutedWords();

  const visitedEntryLightener = new VisitedEntryLightener({
    entries,
    rootElement,
  });
  await visitedEntryLightener.initialize();
  await visitedEntryLightener.mute();
}
