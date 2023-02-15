const $ = <T extends HTMLElement>(selector: string) =>
  document.querySelector<T>(selector);
const $$ = <T extends HTMLElement>(selector: string) => [
  ...document.querySelectorAll<T>(selector),
];

chrome.runtime.onMessage.addListener((req) => {
  alert(JSON.stringify(req));
});

const applyNg = ({ words, urls }: { words: boolean; urls: boolean }) => {};

(async () => {
  if ($('.entrylist-wrapper')) return;
})();

// Templates.entry();
// Templates.siteMuteButton();
//
//
// for (const domainWrapper of $$('.entrylist-contents-domain')) {
//   domainWrapper.appendChild(
// createElementFromString();
//   );
// }
//
