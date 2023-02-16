const normalizeText = (text: string) =>
  text
    .split(/\n+/)
    .filter((line) => line.length > 0)
    .join('\n');

export const storage = {
  getText: async (key: StorageKey): Promise<string | undefined> =>
    (await chrome.storage.local.get(key))[key],

  setText: async (key: StorageKey, text: string) =>
    chrome.storage.local.set({
      [key]: normalizeText(text),
    }),

  getLines: async (key: StorageKey): Promise<string[]> => {
    const text = await storage.getText(key);
    if (text === undefined || text === '') return [];
    return normalizeText(text).split('\n');
  },
};
