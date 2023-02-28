import 'fake-indexeddb/auto';
import type { IDBPObjectStore } from 'idb';
import { userOption } from '.';
import { indexedDb } from './indexedDb';

const URL = 'https://example.com/';
const OBJECT_STORE_NAME = 'mutedUrls';
const NOW = 1600000000000;

type ObjectStore = IDBPObjectStore<unknown, [string], string, 'readwrite'>;

let DB: indexedDb;
beforeAll(async () => {
  jest.useFakeTimers();
  jest.setSystemTime(NOW);

  DB = await userOption.indexedDb.openDb({
    db: {
      name: 'hatenaMute',
      version: 1,
    },
    objectStore: {
      name: OBJECT_STORE_NAME,
      keyPath: 'url',
      indexName: 'by_created',
      indexPath: 'created',
    },
  });
});

afterEach(async () => {
  await transaction(DB, async (objectStore) => {
    await objectStore.clear();
  });
});

afterAll(() => jest.useRealTimers());

const transaction = async (
  db: indexedDb,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (record: ObjectStore) => Promise<any>,
) => {
  const tx = db.plainDb.transaction(OBJECT_STORE_NAME, 'readwrite');
  const result = await fn(tx.objectStore(OBJECT_STORE_NAME) as ObjectStore);
  await tx.done;
  return result;
};

const get = async (url: string) =>
  await transaction(DB, async (objectStore) => {
    return await objectStore.get(url);
  });

describe('get()', () => {
  test('empty result', async () => {
    expect(await get(URL)).toBeUndefined();
  });
});

describe('getMap()', () => {
  test('basic', async () => {
    const url2 = 'https://example.com/2';
    await DB.put(URL);
    const map = await DB.getMap([URL, url2]);
    expect(map.get(URL)).toBe(true);
    expect(map.get(url2)).toBe(false);
  });
});

describe('put()', () => {
  test('adds new object', async () => {
    await DB.put(URL);
    expect(await get(URL)).toEqual({
      url: URL,
      created: new Date(1600000000000),
    });
  });

  test('object already exists and be updated', async () => {
    await DB.put(URL);
    jest.advanceTimersByTime(1000);
    await DB.put(URL);
    expect((await get(URL))?.created).toEqual(new Date(NOW + 1000));
  });
});

describe('deleteAll()', () => {
  test('no records', async () => {
    expect(await DB.deleteAll({ olderThan: new Date() })).toBe(0);
  });

  test('out of range', async () => {
    await DB.put(URL);
    expect(
      await DB.deleteAll({
        olderThan: new Date('2000/01/01 00:00:00'),
      }),
    ).toBe(0);
  });

  test('deletes some records', async () => {
    await transaction(DB, async (objectStore) => {
      await Promise.all([
        objectStore.put({
          url: `${URL}1`,
          created: new Date('2000/01/01 00:00:01'),
        }),
        objectStore.put({
          url: `${URL}2`,
          created: new Date('2000/01/01 00:00:02'),
        }),
        objectStore.put({
          url: `${URL}3`,
          created: new Date('2000/01/01 00:00:03'),
        }),
        objectStore.put({
          url: `${URL}4`,
          created: new Date('2000/01/01 00:00:04'),
        }),
        objectStore.put({
          url: `${URL}5`,
          created: new Date('2000/01/01 00:00:05'),
        }),
      ]);
    });
    expect(
      await DB.deleteAll({
        olderThan: new Date('2000/01/01 00:00:03'),
      }),
    ).toBe(3);

    await transaction(DB, async (objectStore) => {
      expect(await objectStore.getAllKeys()).toEqual([`${URL}4`, `${URL}5`]);
    });
  });
});
