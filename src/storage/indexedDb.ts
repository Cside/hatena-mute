import * as idb from 'idb';
import { INDEXED_DB } from '../constants';

import type { IDB } from '../types';

const openDb = async () => {
  return await idb.openDB(INDEXED_DB.NAME, INDEXED_DB.VERSION, {
    // クライアントがデータベースを未構築の場合に発火。version を上げた場合も発火
    upgrade(db) {
      for (const objectStoreScheme of INDEXED_DB.OBJECT_STORE_SCHEMES) {
        const store = db.createObjectStore(objectStoreScheme.NAME, {
          keyPath: objectStoreScheme.KEY_PATH,
        });
        for (const index of objectStoreScheme.INDEXES)
          store.createIndex(index.NAME, index.PATH);
      }
    },
    blocked(currentVersion, blockedVersion) {
      console.error(
        `Older versions of the database are opened on the origin, so this version cannot open`,
        { currentVersion, blockedVersion },
      );
    },
    blocking(currentVersion, blockedVersion) {
      console.error(
        `This connection is blocking a future version of the database from opening`,
        { currentVersion, blockedVersion },
      );
    },
    terminated() {
      console.error(
        `The browser abnormally terminates the connection, but db.close() hasn't called`,
      );
    },
  });
};

const execute = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (db: IDB) => Promise<any>,
) => {
  const db = await openDb();
  const result = await fn(db);
  db.close();
  return result;
};

/*
  await storage.indexedDB.mutedEntries.transaction('readwrite', mutedEntries => {
    mutedEntries インスタンス
  });
*/
export const indexedDb = {
  mutedEntries: {
    transaction: async (
      mode: 'readonly' | 'readwrite',
      fn: (db: IDB) => Promise<any>,
    ) => {
      const db = await openDb();
      const tx = db.transaction('mutedEntries', mode);

      const result = await fn(db);

      await tx.done;
      db.close();
      return result;
    },
  },
};
