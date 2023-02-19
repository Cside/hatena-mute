import { STORAGE_KEY } from '../constants';

export const SETTINGS = {
  [STORAGE_KEY.LIGHTENS_VISITED_ENTRY]: {
    default: false,
  },
  [STORAGE_KEY.REGARDS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED_AS_VISITED]: {
    default: false,
  },
} as const satisfies {
  [key: string]: { default: boolean };
};

export const userOption = {
  get: async (key: UserOptionsStorageKey) =>
    (await chrome.storage.local.get(key))[key] ?? SETTINGS[key].default,

  set: async (key: UserOptionsStorageKey, value: boolean) =>
    await chrome.storage.local.set({
      [key]: value,
    }),
};
