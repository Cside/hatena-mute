import { STORAGE_KEY } from '../constants';

export const SETTINGS = {
  [STORAGE_KEY.LIGHTENS_VISITED_ENTRY]: {
    default: false,
  },
  [STORAGE_KEY.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED]: {
    default: false,
  },
} as const;

export const userOption = {
  get: async (key: StorageKey): Promise<boolean> =>
    (await chrome.storage.local.get(key))[key] ??
    SETTINGS[key as keyof typeof SETTINGS].default,

  set: async (key: StorageKey, value: boolean) =>
    await chrome.storage.local.set({
      [key]: value,
    }),
};
