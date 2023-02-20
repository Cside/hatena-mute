import { ACTION } from '../constants';
import { EntriesManager } from './EntriesManager';
import './styles.module.scss';

const entryManager = new EntriesManager();

chrome.runtime.onMessage.addListener(async ({ type }: { type: string }) => {
  switch (type) {
    case ACTION.UPDATE_MUTED_SITES:
      await entryManager.muteBySites();
      break;
    case ACTION.UPDATE_MUTED_WORDS:
      await entryManager.muteByMutedWords();
      break;

    default:
      throw new Error(`Unknown action type: ${type}`);
  }
});

if (entryManager.exists()) {
  entryManager.injectCss();
  await entryManager.loadHistory();
  await entryManager.muteBySites();
  await entryManager.muteByMutedWords();
  await entryManager.appendMuteButtons();
}
