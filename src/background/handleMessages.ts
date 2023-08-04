import type { IndexedDb, MessageParameters } from '../types';

import { serializeError } from 'serialize-error';
import { ACTION_OF } from '../constants';

export const run = (db: IndexedDb) => {
  chrome.runtime.onMessage.addListener(
    ({ type, payload }: MessageParameters, _sender, sendResponse) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        switch (type) {
          case ACTION_OF.GET_VISITED_MAP:
            return await Promise.all(
              payload.urls.map(async (url) => {
                return [
                  url,
                  (await chrome.history.getVisits({ url })).length > 0,
                ] as [string, boolean];
              }),
            );
          case ACTION_OF.GET_MUTED_ENTRY_MAP:
            return await db.mutedEntries.getMap(payload.urls);

          case ACTION_OF.ADD_HISTORY:
            return await chrome.history.addUrl({ url: payload.url });

          case ACTION_OF.ADD_MUTED_ENTRY:
            return await db.mutedEntries.put({ url: payload.url });

          default:
            throw new Error(`Unknown action type: ${type}`);
        }
      })()
        .then((result) => {
          sendResponse({
            success: true,
            data: result,
          });
        })
        .catch((error) => {
          console.error(error);
          sendResponse({
            success: false,
            error: serializeError(
              error instanceof Error ? error : new Error(String(error)),
            ),
          });
        });

      return true;
    },
  );
};
