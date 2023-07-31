import * as idb from 'idb';
import { INDEXED_DB } from '../constants';

import { MutedEntries } from './indexedDb/MutedEntries';

const openDb = async () => {
  const result = await idb.openDB(INDEXED_DB.NAME, INDEXED_DB.VERSION, {
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
  console.info('indexedDB is connected');
  return result;
};

export const indexedDb = {
  open: async () => {
    const db = await openDb();
    return {
      mutedEntries: new MutedEntries({ db }),
    };
  },
};
