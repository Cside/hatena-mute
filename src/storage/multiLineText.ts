import type { StorageKey } from '../types';

const normalizeText = (text: string) =>
  text
    .split(/(?:\r?\n)+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');

export const multiLineText = {
  getWhole: async (key: StorageKey) => ((await chrome.storage.local.get(key))[key] ?? '') as string,

  setWhole: async (key: StorageKey, text: string) =>
    chrome.storage.local.set({
      [key]: normalizeText(text),
    }),

  getAllLines: async (key: StorageKey): Promise<string[]> => {
    const plainText = await multiLineText.getWhole(key);
    if (plainText === undefined || plainText === '') return [];
    return normalizeText(plainText).split(/\r?\n/);
  },

  appendLine: async (key: StorageKey, line: string) => {
    const plainText = await multiLineText.getWhole(key);
    await multiLineText.setWhole(
      key,
      plainText === undefined || plainText === '' ? line : `${plainText}\n${line}`,
    );
  },
};
