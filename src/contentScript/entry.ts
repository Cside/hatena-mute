import type { Entry } from '../types';

import { $, $$ } from '../utils';

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
    entry.classList.add('hm-entry');
    try {
      entries.push({
        element: entry,
        titleLink: $<HTMLAnchorElement>(entry, selectors.titleLink),
        commentsLinks: $$<HTMLAnchorElement>(entry, selectors.commentsLink),
        domain: $(entry, selectors.domain),
        ...(selectors.description ? { description: $(entry, selectors.description) } : {}),
      });
    } catch (error) {
      console.error(error);
    }
  }
  return entries;
};

export const getEntries = () => {
  return [
    ..._getEntries({
      selectors: {
        // TODO: このセレクタもう少しどうにかならんかね...。li とか div とか壊れやすそう。
        // cat-*, js-keyboard-selectable-item あたりで絞るとか
        //  -> cat-* は後で読むランキングに無い
        // ここをいじったら icon.pcss も変えること
        // .entrylist-recommend ->「人気エントリーもどうぞ」
        entry: `
          :where(
            .entrylist-header-main,
            .entrylist-item
          ) > li:not(.entrylist-recommend)`,
        // [data-entry-id] は遅延的に生える場合があるため使えない
        titleLink: '.entrylist-contents-title a',
        commentsLink: `
          :where(
            .entrylist-contents-users,
            .entrylist-contents-body
          ) a`,
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
