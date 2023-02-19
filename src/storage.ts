const normalizeText = (text: string) =>
  text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');

export const storage = {
  get: async <T>(key: string): Promise<T | undefined> =>
    (await chrome.storage.local.get(key))[key] as T,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: async (key: string, value: unknown) =>
    await chrome.storage.local.set({ [key]: value }),

  getText: async (key: StorageKey) => await storage.get<string>(key),

  setText: async (key: StorageKey, text: string) =>
    chrome.storage.local.set({
      [key]: normalizeText(text),
    }),

  getLines: async (key: StorageKey): Promise<string[]> => {
    const text = await storage.getText(key);
    if (text === undefined || text === '') return [];
    return normalizeText(text).split('\n');
  },

  addLine: async (key: StorageKey, line: string) => {
    const text = await storage.getText(key);
    await storage.setText(
      key,
      text === undefined || text === '' ? line : `${text}\n${line}`,
    );
  },
};
