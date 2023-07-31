import { fakeStorage } from '../../test/chrome/fakeStorage';
import { STORAGE_KEY } from '../constants';
import { storage } from '../storage';

const KEY = STORAGE_KEY.MUTED_SITES;

afterEach(async () => {
  await fakeStorage.clear();
});

test('getWhole()', async () => {
  expect(await storage.multiLineText.getWhole(KEY)).toBe('');
});

describe('setWhole()', () => {
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
      input: ' foo　',
      expected: 'foo',
    },
    {
      input: 'foo\n \nbar',
      expected: 'foo\nbar',
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
    await storage.multiLineText.setWhole(KEY, input);
    expect(await storage.multiLineText.getWhole(KEY)).toBe(expected);
  });
});

describe('getAllLines()', () => {
  test.each([
    {
      input: 'foo',
      expected: ['foo'],
    },
    {
      input: ' foo　',
      expected: ['foo'],
    },
    {
      input: 'foo\nbar',
      expected: ['foo', 'bar'],
    },
    {
      input: 'foo\n\nbar',
      expected: ['foo', 'bar'],
    },
    {
      input: 'foo\n　\nbar',
      expected: ['foo', 'bar'],
    },
    {
      input: '',
      expected: [],
    },
  ])('%o', async ({ input, expected }) => {
    await chrome.storage.local.set({ [KEY]: input });
    expect(await storage.multiLineText.getAllLines(KEY)).toEqual(expected);
  });
});

describe('appendLine()', () => {
  test.each([
    {
      input: undefined,
      expected: 'foo',
    },
    {
      input: '',
      expected: 'foo',
    },
    {
      input: 'bar',
      expected: 'bar\nfoo',
    },
  ])('%o', async ({ input, expected }) => {
    if (input !== undefined) await chrome.storage.local.set({ [KEY]: input });
    await storage.multiLineText.appendLine(KEY, 'foo');
    expect(await storage.multiLineText.getWhole(KEY)).toEqual(expected);
  });
});
