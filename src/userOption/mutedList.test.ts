import { fakeStorage } from '../../test/chrome/fakeStorage';
import { STORAGE_KEY } from '../constants';
import { mutedList } from './mutedList';

const KEY = STORAGE_KEY.MUTED_SITES;

afterEach(async () => {
  await fakeStorage.clear();
});

test('getText', async () => {
  expect(await mutedList.getText(KEY)).toBe('');
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
    await mutedList.setText(KEY, input);
    expect(await mutedList.getText(KEY)).toBe(expected);
  });
});

describe('getList', () => {
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
    expect(await mutedList.getList(KEY)).toEqual(expected);
  });
});

describe('addItem', () => {
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
    await mutedList.addItem(KEY, 'foo');
    expect(await mutedList.getText(KEY)).toEqual(expected);
  });
});
