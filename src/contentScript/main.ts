import { EntryList } from './EntryList';

const $ = <T extends HTMLElement>(selector: string) =>
  document.querySelector<T>(selector);
const $$ = <T extends HTMLElement>(selector: string) => [
  ...document.querySelectorAll<T>(selector),
];

chrome.runtime.onMessage.addListener((req) => {
  // alert(JSON.stringify(req));
});

(async () => {
  const entryList = new EntryList();

  if (!entryList.exists()) return;
  entryList.filterByNgWords();
  entryList.filterByUrls();
})();
