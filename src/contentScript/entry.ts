import { $, $$ } from './utils';

// 3 種類のデザインの DOM アクセスを抽象化する処理だけ書く
// それ以外は entry.element.querySelector() で頑張る
const _getEntries = ({
  selectors,
}: {
  selectors: {
    entry: string;
    titleLink: string;
    commentsLink: string;
    domain: string;
    description?: string;
  };
}) => {
  const entries: Entry[] = [];
  for (const entry of $$(selectors.entry)) {
    entries.push({
      element: entry,
      titleLink: $<HTMLAnchorElement>(entry, selectors.titleLink),
      commentsLink: $<HTMLAnchorElement>(entry, selectors.commentsLink),
      domain: $(entry, selectors.domain),
      ...(selectors.description
        ? { description: $(entry, selectors.description) }
        : {}),
    });
  }
  return entries;
};

export const getEntries = () => {
  return [
    ..._getEntries({
      selectors: {
        entry:
          ':where(.entrylist-header-main, .entrylist-item) > li:not(.entrylist-recommend)',
        titleLink: '.entrylist-contents-title a',
        commentsLink:
          ':where(.entrylist-contents-users, .entrylist-contents-body) a',
        description: '.entrylist-contents-description',
        domain: '.entrylist-contents-domain a',
      },
    }),
    ..._getEntries({
      selectors: {
        entry: '.entrylist-readlater-ranking-item',
        titleLink: '.entrylist-readlater-ranking-title a',
        commentsLink: 'a.entrylist-readlater-ranking-head',
        domain: '.entrylist-readlater-ranking-domain a',
      },
    }),
    ..._getEntries({
      selectors: {
        entry: '.entrylist-3column-items > li',
        titleLink: '.entrylist-3column-title a',
        commentsLink: '.entrylist-3column-users a',
        domain: '.entrylist-3column-domain a',
      },
    }),
  ];
};
