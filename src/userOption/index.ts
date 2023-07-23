import { STORAGE_KEY } from '../constants';
import type { StorageKey } from '../types';
import { indexedDb } from './indexedDb';
import { text } from './text';

const DEFAULTS = {
  [STORAGE_KEY.IS_EXTENSION_ENABLED]: true,
  [STORAGE_KEY.LIGHTENS_VISITED_ENTRY]: false,
  [STORAGE_KEY.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED]: false,
} as const;

export const userOption = {
  get: async <T>(key: StorageKey): Promise<T> =>
    (await chrome.storage.local.get(key))[key] ??
    DEFAULTS[key as keyof typeof DEFAULTS],

  set: async (key: StorageKey, value: boolean) =>
    await chrome.storage.local.set({
      [key]: value,
    }),
  text,
  indexedDb,
};
