import type { Entry } from '../../types';

import { ACTION_OF, STORAGE_KEY_OF } from '../../constants';
import { sendMessageToBg } from '../../sendMessage';
import { storage } from '../../storage';

import './styles.pcss';

type ExtendedEntry = Entry & {
  commentsUrl: string;
};

const GA_PARAM = '_gl';

export class VisitedEntryLightener {
  entries: ExtendedEntry[] = [];
  rootElement: HTMLElement;

  visitedMap: {
    [k: string]: boolean;
  } = {};

  options: {
    lightensVisitedEntry: boolean;
    lightenEntryWhoseCommentsHaveBeenVisited: boolean;
  } = {
    lightensVisitedEntry: false,
    lightenEntryWhoseCommentsHaveBeenVisited: false,
  };

  constructor({ entries, rootElement }: { entries: Entry[]; rootElement: HTMLElement }) {
    for (const entry of entries) {
      const commentsUrl = entry.commentsLinks[0]?.href;
      if (!commentsUrl) throw new Error(`entry.commentsLinks === 0`);
      this.entries.push({
        ...entry,
        commentsUrl,
      });
    }
    this.rootElement = rootElement;
  }

  addClickListeners() {
    for (const entry of this.entries) {
      const setVisited = () => entry.element.classList.add('hm-visited');

      entry.titleLink.addEventListener('click', async (event) => {
        if (!(event.target instanceof HTMLAnchorElement))
          throw new TypeError(`event.target is not HTMLAnchorElement`);

        // GA のクエリパラメータが付けられた URL は
        // GA のクエリパラメータを除去して履歴に追加する
        const url = new URL(event.target.href);
        if (url.searchParams.has(GA_PARAM)) {
          url.searchParams.delete(GA_PARAM);
          await sendMessageToBg({
            type: ACTION_OF.ADD_HISTORY,
            payload: { url: url.toString() },
          });
        }
        setVisited();
      });
      for (const commentsLink of entry.commentsLinks) {
        commentsLink.addEventListener('click', () => {
          if (this.options.lightenEntryWhoseCommentsHaveBeenVisited) setVisited();
        });
      }
    }
  }

  private async loadOptions() {
    this.options = {
      lightensVisitedEntry: await storage.get(STORAGE_KEY_OF.LIGHTENS_VISITED_ENTRY),
      lightenEntryWhoseCommentsHaveBeenVisited: await storage.get(
        STORAGE_KEY_OF.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED,
      ),
    };
  }

  async lighten() {
    await this.loadOptions();

    this.rootElement.classList[this.options.lightensVisitedEntry ? 'add' : 'remove'](
      'hm-lightens-visited-entry',
    );

    // NOTE: たまに sendMessage が返ってこないケースがある ( = これ以降の処理が実行されないケースがある)
    // コンストラクタでやると、popup から再呼び出しされたときに、
    // バックグランドで開いた URL の .visited がリセットされてしまうため、都度呼ぶ
    const visitedMap: Map<string, boolean> = new Map(
      (await sendMessageToBg({
        type: ACTION_OF.GET_VISITED_MAP,
        payload: {
          urls: this.entries.map((entry) => [entry.titleLink.href, entry.commentsUrl]).flat(),
        },
      })) as [string, boolean][],
    );

    for (const entry of this.entries) {
      const isEntryVisited = visitedMap.get(entry.titleLink.href);
      const isCommentVisited = visitedMap.get(entry.commentsUrl);

      if (isEntryVisited === undefined)
        throw new Error(`key (${entry.titleLink.href}) doesn't exist in visitedMap`);
      if (isCommentVisited === undefined)
        throw new Error(`key (${entry.titleLink.href}) doesn't exist in visitedMap`);

      entry.element.classList[
        isEntryVisited ||
        (this.options.lightenEntryWhoseCommentsHaveBeenVisited && isCommentVisited)
          ? 'add'
          : 'remove'
      ]('hm-visited');
    }
  }
}
