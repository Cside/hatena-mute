import 'fake-indexeddb/auto';
import { storage } from '../../storage';
import { MutedEntries } from './MutedEntries';

const URL = 'https://example.com/';
const NOW = 1600000000000;

let mutedEntries: MutedEntries;

beforeAll(async () => {
  mutedEntries = (await storage.indexedDb.open()).mutedEntries;

  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(async () => mutedEntries.clear());

afterAll(() => {
  vi.useRealTimers();
});

describe('get()', () => {
  test('empty result', async () => {
    expect(await mutedEntries.get(URL)).toBeUndefined();
  });
});

describe('getMap()', () => {
  test('no arguments', async () => {
    expect(await mutedEntries.getMap([])).toEqual([]);
  });

  test('has result', async () => {
    const url2 = 'https://example.com/2';

    await mutedEntries.put({ url: URL });

    expect(await mutedEntries.getMap([URL, url2])).toEqual([
      [URL, true],
      [url2, false],
    ]);
  });
});

describe('put()', () => {
  test('adds new object', async () => {
    await mutedEntries.put({ url: URL });

    expect(await mutedEntries.get(URL)).toEqual({
      url: URL,
      created: new Date(1600000000000),
    });
  });

  test('object already exists and be updated', async () => {
    const newerDate = new Date(NOW + 1000);

    await mutedEntries.put({ url: URL, created: new Date() });
    await mutedEntries.put({ url: URL, created: newerDate });

    expect((await mutedEntries.get(URL))?.created).toEqual(newerDate);
  });
});

describe('deleteAll()', () => {
  test('no records', async () => {
    expect(await mutedEntries.deleteAll({ olderThan: new Date() })).toBe(0);
  });

  test('out of range', async () => {
    await mutedEntries.put({ url: URL });

    expect(
      await mutedEntries.deleteAll({
        olderThan: new Date('2000/01/01 00:00:00'),
      }),
    ).toBe(0);
  });

  test('deletes some records', async () => {
    await Promise.all([
      mutedEntries.put({
        url: `${URL}1`,
        created: new Date('2000/01/01 00:00:01'),
      }),
      mutedEntries.put({
        url: `${URL}2`,
        created: new Date('2000/01/01 00:00:02'),
      }),
      mutedEntries.put({
        url: `${URL}3`,
        created: new Date('2000/01/01 00:00:03'),
      }),
      mutedEntries.put({
        url: `${URL}4`,
        created: new Date('2000/01/01 00:00:04'),
      }),
      mutedEntries.put({
        url: `${URL}5`,
        created: new Date('2000/01/01 00:00:05'),
      }),
    ]);

    expect(
      await mutedEntries.deleteAll({
        olderThan: new Date('2000/01/01 00:00:03'),
      }),
    ).toBe(3);

    expect(await mutedEntries.getAllKeys()).toEqual([`${URL}4`, `${URL}5`]);
  });
});
