import type { Action } from '../types';

import manifest from '../../manifest.json';

if (!manifest.content_scripts[0])
  throw new Error(`manifest.content_scripts is empty`);

const URL_PATTERNS = manifest.content_scripts[0].matches;

export const executeActionInContentScripts = async (action: Action) => {
  await Promise.all(
    (await chrome.tabs.query({ url: URL_PATTERNS })).map(async (tab) => {
      const tabId = tab.id ?? 0;
      try {
        await chrome.tabs.sendMessage(tabId, {
          type: action,
        });
      } catch (error) {
        console.info(
          `Could not establish connection to ${tab.url} . Maybe old tabs exist since before installation.\n${error}`,
        );
        await chrome.tabs.reload(tabId ?? 0);
      }
    }),
  );
};
