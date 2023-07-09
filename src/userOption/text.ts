import type { StorageKey } from '../types';

const normalizeText = (text: string) =>
  text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');

export const text = {
  getPlain: async (key: StorageKey) =>
    ((await chrome.storage.local.get(key))[key] ?? '') as string,

  setPlain: async (key: StorageKey, text: string) =>
    chrome.storage.local.set({
      [key]: normalizeText(text),
    }),

  getLines: async (key: StorageKey): Promise<string[]> => {
    const plainText = await text.getPlain(key);
    if (plainText === undefined || plainText === '') return [];
    return normalizeText(plainText).split('\n');
  },

  appendLine: async (key: StorageKey, item: string) => {
    const plainText = await text.getPlain(key);
    await text.setPlain(
      key,
      plainText === undefined || plainText === ''
        ? item
        : `${plainText}\n${item}`,
    );
  },
};
