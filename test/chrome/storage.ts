import { chrome } from 'jest-chrome';
import { fakeStorage } from './fakeStorage';

beforeAll(() => {
  chrome.storage.local.clear.mockImplementation(fakeStorage.clear);

  chrome.storage.local.get.mockImplementation(
    fakeStorage.get as typeof chrome.storage.local.get,
  );
  chrome.storage.local.remove.mockImplementation(
    fakeStorage.remove as typeof chrome.storage.local.remove,
  );
  chrome.storage.local.set.mockImplementation(
    fakeStorage.set as typeof chrome.storage.local.set,
  );
});

afterAll(() => {
  jest.resetAllMocks();
});
