import { ACTION } from '../constants';

const hasVisited = async (url: string) =>
  (await chrome.history.getVisits({ url })).length > 0;

const handleLoadHistory = async (urls: string[]) =>
  Object.fromEntries(
    await Promise.all(
      urls.map(
        async (url) => [url, await hasVisited(url)] as [string, boolean],
      ),
    ),
  );

chrome.runtime.onMessage.addListener(
  (
    { type, payload: { urls } }: { type: string; payload: { urls: string[] } },
    _sender,
    sendResponse,
  ) => {
    console.info(`action: ${type}`);

    switch (type) {
      case ACTION.GET_VISITED_MAP:
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        handleLoadHistory(urls).then((result) => sendResponse(result));
        break;

      default:
        throw new Error(`Unknown action type: ${type}`);
    }
    return true;
  },
);
