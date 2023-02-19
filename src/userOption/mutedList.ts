import { STORAGE_KEY } from '../constants';

export const STORAGE_KEYS = [
  STORAGE_KEY.MUTED_SITES,
  STORAGE_KEY.MUTED_WORDS,
] as const;

const normalizeText = (text: string) =>
  text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');

export const mutedList = {
  getText: async (key: MutedListsStorageKey) =>
    ((await chrome.storage.local.get(key))[key] ?? '') as string,

  setText: async (key: MutedListsStorageKey, text: string) =>
    chrome.storage.local.set({
      [key]: normalizeText(text),
    }),

  getList: async (key: MutedListsStorageKey): Promise<string[]> => {
    const text = await mutedList.getText(key);
    if (text === undefined || text === '') return [];
    return normalizeText(text).split('\n');
  },

  addItem: async (key: MutedListsStorageKey, item: string) => {
    const text = await mutedList.getText(key);
    await mutedList.setText(
      key,
      text === undefined || text === '' ? item : `${text}\n${item}`,
    );
  },
};
