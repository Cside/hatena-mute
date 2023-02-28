import 'fake-indexeddb/auto';
import type { IDBPObjectStore } from 'idb';
import { userOption } from '.';
import { indexedDb } from './indexedDb';

const URL = 'https://example.com/';
const OBJECT_STORE_NAME = 'mutedUrls';

let DB: indexedDb;
beforeAll(async () => {
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

type ObjectStore = IDBPObjectStore<unknown, [string], string, 'readwrite'>;

const transaction = async (
  db: indexedDb,
  fn: (record: ObjectStore) => Promise<void>,
) => {
  const tx = db.plainDb.transaction(OBJECT_STORE_NAME, 'readwrite');
  await fn(tx.objectStore(OBJECT_STORE_NAME) as ObjectStore);
  await tx.done;
};

afterEach(async () => {
  await transaction(DB, async (mutedUrls) => {
    await mutedUrls.clear();
  });
});

describe('get()', () => {
  test('empty result', async () => {
    expect(await DB.get(URL)).toBeUndefined();
  });
});

describe('put()', () => {
  test('adds new object', async () => {
    const object = { url: URL, created: new Date() };
    await DB.put(object);
    expect(await DB.get(URL)).toEqual(object);
  });

  test('object already exists and be updated', async () => {
    const pastTime = '2000/01/01 00:00:00';
    await Promise.all([
      DB.put({ url: URL, created: new Date() }),
      DB.put({ url: URL, created: new Date(pastTime) }),
    ]);
    expect((await DB.get(URL))?.created).toEqual(new Date(pastTime));
  });
});

describe('deleteAll()', () => {
  test('no records', async () => {
    expect(await DB.deleteAll({ olderThan: new Date() })).toBe(0);
  });

  test('out of range', async () => {
    await DB.put({ url: URL, created: new Date() });
    expect(
      await DB.deleteAll({
        olderThan: new Date('2000/01/01 00:00:00'),
      }),
    ).toBe(0);
  });

  test('deletes some records', async () => {
    await Promise.all([
      DB.put({ url: `${URL}1`, created: new Date('2000/01/01 00:00:01') }),
      DB.put({ url: `${URL}2`, created: new Date('2000/01/01 00:00:02') }),
      DB.put({ url: `${URL}3`, created: new Date('2000/01/01 00:00:03') }),
      DB.put({ url: `${URL}4`, created: new Date('2000/01/01 00:00:04') }),
      DB.put({ url: `${URL}5`, created: new Date('2000/01/01 00:00:05') }),
    ]);
    expect(
      await DB.deleteAll({
        olderThan: new Date('2000/01/01 00:00:03'),
      }),
    ).toBe(3);

    await transaction(DB, async (mutedUrls) => {
      expect(await mutedUrls.getAllKeys()).toEqual([`${URL}4`, `${URL}5`]);
    });
  });
});
