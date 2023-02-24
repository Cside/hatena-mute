import { ACTION } from '../constants';
import './deleteMutedEntryRegularly';
import { getVisitedMap } from './getVisitedMap';

chrome.runtime.onMessage.addListener(
  (
    {
      type,
      payload: { urls },
    }: {
      type: string;
      payload: { urls: string[] };
    },
    _sender,
    sendResponse,
  ) => {
    console.info(`action: ${type}`);

    switch (type) {
      case ACTION.GET_VISITED_MAP:
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getVisitedMap(urls).then((result) => sendResponse(result));
        break;

      default:
        throw new Error(`Unknown action type: ${type}`);
    }
    return true;
  },
);
