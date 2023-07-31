import type { IndexedDb } from '../types';

import { ACTION } from '../constants';

type MessageParams =
  | {
      type: typeof ACTION.GET_VISITED_MAP;
      payload: { urls: string[] };
    }
  | {
      type: typeof ACTION.ADD_HISTORY;
      payload: { url: string };
    }
  | {
      type: typeof ACTION.ADD_MUTED_ENTRY;
      payload: { url: string };
    }
  | {
      type: typeof ACTION.GET_MUTED_ENTRY_MAP;
      payload: { urls: string[] };
    };

export const run = (db: IndexedDb) => {
  chrome.runtime.onMessage.addListener(
    ({ type, payload }: MessageParams, _sender, sendResponse) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        switch (type) {
          case ACTION.GET_VISITED_MAP:
            return await Promise.all(
              payload.urls.map(async (url) => {
                // await chrome.history.deleteUrl({ url }); // for debug
                return [
                  url,
                  (await chrome.history.getVisits({ url })).length > 0,
                ] as [string, boolean];
              }),
            );
          case ACTION.ADD_HISTORY:
            return await chrome.history.addUrl({ url: payload.url });

          case ACTION.ADD_MUTED_ENTRY:
            // FIXME これ sendResponse する必要ないな？
            return await db.mutedEntries.put(payload.url);

          case ACTION.GET_MUTED_ENTRY_MAP:
            return await db.mutedEntries.getMap(payload.urls);

          default:
            throw new Error(`Unknown action type: ${type}`);
        }
      })().then((result) => sendResponse(result));

      return true;
    },
  );
};
