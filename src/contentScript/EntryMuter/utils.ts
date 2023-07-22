const zenkakuToHankaku = (str: string) =>
  str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (str: string) =>
    String.fromCharCode(str.charCodeAt(0) - 0xfee0),
  );

const normalizeString = (str: string) => zenkakuToHankaku(str.toUpperCase());

export const matchesLoosely = (a: string, b: string) =>
  normalizeString(a).includes(normalizeString(b.toUpperCase()));

export const replaceUrlsInCss = (css: string) =>
  css.replace(
    /url\(["']?(.+?)["']?\)/g,
    `url('${chrome.runtime.getURL('$1')}')`,
  );
