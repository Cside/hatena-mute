import { ACTION } from '../constants';
import { EntryList } from './EntryList';
import './styles.scss';

const $ = <T extends HTMLElement>(selector: string) =>
  document.querySelector<T>(selector);
const $$ = <T extends HTMLElement>(selector: string) => [
  ...document.querySelectorAll<T>(selector),
];

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
  entryList.filterByUrls();
  entryList.filterByNgWords();
})();
