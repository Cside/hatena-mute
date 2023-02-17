import { ACTION } from '../constants';
import { EntryList } from './EntryList';
import './styles.scss';

const entryList = new EntryList();

chrome.runtime.onMessage.addListener(({ type }: { type: string }) => {
  switch (type) {
    case ACTION.UPDATE_NG_URLS:
      entryList.filterByUrls();
      break;
    case ACTION.UPDATE_NG_WORDS:
      entryList.filterByNgWords();
      break;

    default:
      throw new Error(`Unknown action type: ${type}`);
  }
});

(async () => {
  if (!entryList.exists()) return;
  entryList.injectCss();
  await entryList.filterByUrls();
  await entryList.filterByNgWords();
  await entryList.appendMuteButtons();
})();
