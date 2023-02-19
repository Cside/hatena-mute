import { ACTION } from '../constants';
import { EntriesManager } from './EntriesManager';
import './styles.module.scss';

const entryManager = new EntriesManager();

chrome.runtime.onMessage.addListener(async ({ type }: { type: string }) => {
  switch (type) {
    case ACTION.UPDATE_MUTED_SITES:
      await entryManager.filterBySites();
      break;
    case ACTION.UPDATE_MUTED_WORDS:
      await entryManager.filterByMutedWords();
      break;

    default:
      throw new Error(`Unknown action type: ${type}`);
  }
});

if (entryManager.exists()) {
  entryManager.injectCss();
  await entryManager.loadHistory();
  await entryManager.filterBySites();
  await entryManager.filterByMutedWords();
  await entryManager.appendMuteButtons();
}
