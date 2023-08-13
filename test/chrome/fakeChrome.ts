import { fakeStorage } from './fakeStorage';

export const fakeChrome = {
  runtime: {
    getURL: vi
      .fn()
      .mockImplementation((str: string) => `chrome://<extension-id>/${str}`),
    id: '<extension-id>',
  },
  storage: {
    local: {
      clear: vi.fn().mockImplementation(fakeStorage.clear),
      get: vi.fn().mockImplementation(fakeStorage.get),
      remove: vi.fn().mockImplementation(fakeStorage.remove),
      set: vi.fn().mockImplementation(fakeStorage.set),
    },
  },
};
