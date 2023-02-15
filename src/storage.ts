const normalizeText = (text: string) =>
  text.split(/\n+/).filter((line) => line.length > 0);

export const storage = {
  getText: async (key: StorageKey): Promise<string | undefined> =>
    (await chrome.storage.local.get(key))[key],

  setText: async (key: StorageKey, text: string) =>
    chrome.storage.local.set({
      [key]: normalizeText(text).join('\n'),
    }),

  getLines: async (key: StorageKey) => {
    const text = await storage.getText(key);
    if (text === undefined || text === '') return undefined;
    return normalizeText(text);
  },
};
