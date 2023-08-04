import * as idb from 'idb';
import { INDEXED_DB } from '../constants';

import { MutedEntries } from './indexedDb/MutedEntries';

const openDb = async () => {
  const result = await idb.openDB(INDEXED_DB.NAME, INDEXED_DB.VERSION, {
    // クライアントがデータベースを未構築の場合に発火。version を上げた場合も発火
    upgrade(db) {
      console.info('[indexedDB] initializing or updating indexedDB');
      for (const objectStoreScheme of Object.values(
        INDEXED_DB.OBJECT_STORE_OF,
      )) {
        const store = db.createObjectStore(objectStoreScheme.NAME, {
          keyPath: objectStoreScheme.KEY_PATH,
        });
        for (const index of Object.values(objectStoreScheme.INDEX_OF))
          store.createIndex(index.NAME, index.PATH);
      }
    },
    blocked(currentVersion, blockedVersion) {
      console.error(
        `[indexedDB] Blocked: Older versions of the database are opened on the origin, so this version cannot open`,
        { currentVersion, blockedVersion },
      );
    },
    blocking(currentVersion, blockedVersion) {
      console.error(
        `[indexedDB] Blocking: This connection is blocking a future version of the database from opening`,
        { currentVersion, blockedVersion },
      );
    },
    // 接続しっぱなしのまま手動で db 消したりすると呼ばれる
    terminated() {
      console.error(
        `[indexedDB] Terminated: The browser abnormally terminates the connection, but db.close() hasn't called`,
      );
    },
  });
  console.info('[indexedDB] connected');
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
