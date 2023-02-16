let store = {};
type Key = keyof typeof store;

export const fakeStorage = {
  clear: async () => {
    store = {};
  },
  get: async (key?: string) => {
    if (key === undefined) return store;
    return Object.hasOwn(store, key) ? { [key]: store[key as Key] } : {};
  },
  remove: async (key: string) => {
    delete store[key as Key];
  },
  set: async (value: object) => {
    store = { ...store, ...value };
  },
};
