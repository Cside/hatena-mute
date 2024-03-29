import type { StorageKey } from './types';

import { STORAGE_KEY_OF } from './constants';
import { multiLineText } from './storage/multiLineText';

const DEFAULTS = {
  [STORAGE_KEY_OF.IS_EXTENSION_ENABLED]: true,
  [STORAGE_KEY_OF.LIGHTENS_VISITED_ENTRY]: false,
  [STORAGE_KEY_OF.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED]: false,
} as const;

export const storage = {
  get: async <T>(key: StorageKey): Promise<T> =>
    (await chrome.storage.local.get(key))[key] ?? DEFAULTS[key as keyof typeof DEFAULTS],

  set: async (key: StorageKey, value: boolean) =>
    await chrome.storage.local.set({
      [key]: value,
    }),
  multiLineText,
};
