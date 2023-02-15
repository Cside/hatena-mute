import { chrome } from 'jest-chrome';

let store = {};
type Key = keyof typeof store;

export const clearStorage = async () => {
  store = {};
};

beforeAll(() => {
  // TODO test for clear/get/remove/set
  chrome.storage.local.clear.mockImplementation(clearStorage);

  chrome.storage.local.get.mockImplementation((async (key: string) => {
    return key === undefined
      ? store
      : {
          [key]: store[key as Key] ?? {},
        };
  }) as typeof chrome.storage.local.get);

  chrome.storage.local.remove.mockImplementation((async (key: string) => {
    delete store[key as Key];
  }) as typeof chrome.storage.local.remove);

  chrome.storage.local.set.mockImplementation((async (value: object) => {
    store = { ...store, ...value };
  }) as typeof chrome.storage.local.set);
});

afterAll(() => {
  jest.resetAllMocks();
});
