import { ACTION } from '../constants';
import { EntryList } from './EntryList';
import './styles.scss';

const entryList = new EntryList();

chrome.runtime.onMessage.addListener(({ type }: { type: string }) => {
  switch (type) {
    case ACTION.UPDATE_MUTED_SITES:
      entryList.filterBySites();
      break;
    case ACTION.UPDATE_MUTED_WORDS:
      entryList.filterByMutedWords();
      break;

    default:
      throw new Error(`Unknown action type: ${type}`);
  }
});

(async () => {
  if (!entryList.exists()) return;
  entryList.injectCss();
  await entryList.filterBySites();
  await entryList.filterByMutedWords();
  await entryList.appendMuteButtons();
})();
