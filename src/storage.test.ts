import { clearStorage } from '../test/chrome/storage';
import { STORAGE_KEY } from './popup/constants';
import { storage } from './storage';

const KEY = STORAGE_KEY.NG_URLS;

afterEach(() => {
  clearStorage();
});

describe('setText', () => {
  test.each([
    {
      input: 'foo\n\nbar',
      expected: 'foo\nbar',
    },
    {
      input: 'foo\n',
      expected: 'foo',
    },
    {
      input: '\nfoo',
      expected: 'foo',
    },
    {
      input: '\n\n',
      expected: '',
    },
  ])('%o', async ({ input, expected }) => {
    await storage.setText(KEY, input);
    expect(await storage.getText(KEY)).toBe(expected);
  });
});

describe('getLines', () => {
  test.each([
    {
      input: 'foo\n\nbar',
      expected: ['foo', 'bar'],
    },
    {
      input: '\nfoo\n',
      expected: ['foo'],
    },
    {
      input: '\n',
      expected: [],
    },
  ])('%o', async ({ input, expected }) => {
    await chrome.storage.local.set({ [KEY]: input });
    expect(await storage.getLines(KEY)).toEqual(expected);
  });
});
