import { fakeStorage } from '../test/chrome/fakeStorage';
import { STORAGE_KEY } from './popup/constants';
import { storage } from './storage';

const KEY = STORAGE_KEY.NG_URLS;

afterEach(() => {
  fakeStorage.clear();
});

test('getText', async () => {
  expect(await storage.getText(KEY)).toBe(undefined);
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
    {
      input: '\nfoo\n\nbar\n',
      expected: 'foo\nbar',
    },
  ])('%o', async ({ input, expected }) => {
    await storage.setText(KEY, input);
    expect(await storage.getText(KEY)).toBe(expected);
  });
});

describe('getLines', () => {
  test.each([
    {
      input: 'foo',
      expected: ['foo'],
    },
    {
      input: 'foo\nbar',
      expected: ['foo', 'bar'],
    },
    {
      input: '',
      expected: [],
    },
  ])('%o', async ({ input, expected }) => {
    await chrome.storage.local.set({ [KEY]: input });
    expect(await storage.getLines(KEY)).toEqual(expected);
  });
});
