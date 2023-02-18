import { ACTION } from '../constants';
import { EntryList } from './EntryList';
import './styles.scss';

const entryList = new EntryList();

chrome.runtime.onMessage.addListener(async ({ type }: { type: string }) => {
  switch (type) {
    case ACTION.UPDATE_MUTED_SITES:
      await entryList.filterBySites();
      break;
    case ACTION.UPDATE_MUTED_WORDS:
      await entryList.filterByMutedWords();
      break;

    default:
      throw new Error(`Unknown action type: ${type}`);
  }
});

if (entryList.exists()) {
  entryList.injectCss();
  await entryList.loadHistory();
  await entryList.filterBySites();
  await entryList.filterByMutedWords();
  await entryList.appendMuteButtons();
}
