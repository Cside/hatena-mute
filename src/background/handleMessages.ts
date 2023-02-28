import { ACTION } from '../constants';
import { userOption } from '../userOption';

type MessageParams =
  | {
      type: typeof ACTION.GET_VISITED_MAP;
      payload: { urls: string[] };
    }
  | {
      type: typeof ACTION.ADD_MUTED_ENTRY;
      payload: { url: string };
    }
  | {
      type: typeof ACTION.GET_MUTED_ENTRY_MAP;
      payload: { urls: string[] };
    };

chrome.runtime.onMessage.addListener(
  ({ type, payload }: MessageParams, _sender, sendResponse) => {
    console.info(`action: ${type}`);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      switch (type) {
        case ACTION.GET_VISITED_MAP:
          return await Promise.all(
            payload.urls.map(
              async (url) =>
                [url, (await chrome.history.getVisits({ url })).length > 0] as [
                  string,
                  boolean,
                ],
            ),
          );
        case ACTION.ADD_MUTED_ENTRY:
          return await userOption.indexedDb.execute(
            async (db) => await db.put(payload.url),
          );

        case ACTION.GET_MUTED_ENTRY_MAP:
          return await userOption.indexedDb.execute(
            async (db) => await db.getMap(payload.urls),
          );

        default:
          throw new Error(`Unknown action type: ${type}`);
      }
    })().then((result) => sendResponse(result));

    return true;
  },
);
