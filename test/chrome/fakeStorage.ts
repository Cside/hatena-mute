// eslint-disable-next-line @typescript-eslint/no-explicit-any
const map = new Map<string, any>();

export const fakeStorage = {
  clear: async () => map.clear(),
  get: async (key?: string) => {
    if (key === undefined) return Object.fromEntries(map);
    return map.has(key) ? { [key]: map.get(key) } : {};
  },
  remove: async (key: string) => map.delete(key),
  set: async (value: object) => {
    for (const pair of Object.entries(value)) map.set(...pair);
  },
};
