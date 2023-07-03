import type { Action } from '../types';

import { getOrigin } from '../utils';

export const executeActionOnContentScripts = async (action: Action) => {
  await Promise.all(
    (
      await chrome.tabs.query({ url: getOrigin() })
    ).map(async (tab) => {
      try {
        await chrome.tabs.sendMessage(tab.id ?? 0, {
          type: action,
        });
      } catch (error) {
        console.info(
          `Could not establish connection. Maybe old tabs exist since before installation.\n${error}`,
        );
        await chrome.tabs.reload(tab.id ?? 0);
      }
    }),
  );
};
