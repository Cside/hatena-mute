import * as idb from 'idb';

const DB = {
  NAME: 'hatenaMute',
  VERSION: 1,
};
export const OBJECT_STORE = {
  NAME: 'mutedUrls',
  VERSION: 1,
  PROPERTY: {
    URL: 'url',
    CREATED_AT: 'created',
  },
  INDEX: { CREATED_AT: 'by_created' },
};

type Record = {
  url: string;
  created: Date;
};

export class MutedEntryDb {
  _db: Awaited<ReturnType<typeof idb.openDB>> | null = null;

  get rawDb() {
    const db = this._db;
    if (!db) throw new Error(`open() is not called yet`);
    return db;
  }

  static async open() {
    const _this = new MutedEntryDb();
    _this._db = await idb.openDB(DB.NAME, DB.VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(OBJECT_STORE.NAME, {
          keyPath: OBJECT_STORE.PROPERTY.URL,
        });
        store.createIndex(
          OBJECT_STORE.INDEX.CREATED_AT,
          OBJECT_STORE.PROPERTY.CREATED_AT,
        );
      },
    });
    return _this;
  }

  async get(url: string) {
    const tx = this.rawDb.transaction(OBJECT_STORE.NAME, 'readonly');

    const mutedUrls = tx.objectStore(OBJECT_STORE.NAME);
    const record = await mutedUrls.get(url);

    return record ? (record as Record) : undefined;
  }

  async put(record: Record) {
    const tx = this.rawDb.transaction(OBJECT_STORE.NAME, 'readwrite');

    const mutedUrls = tx.objectStore(OBJECT_STORE.NAME);
    await mutedUrls.put(record);

    await tx.done;
  }

  async deleteOld({ olderBoundDate }: { olderBoundDate: Date }) {
    const tx = this.rawDb.transaction(OBJECT_STORE.NAME, 'readwrite');

    const mutedUrls = tx.objectStore(OBJECT_STORE.NAME);

    const createdIndex = mutedUrls.index(OBJECT_STORE.INDEX.CREATED_AT);
    const keys = await createdIndex.getAllKeys(
      IDBKeyRange.upperBound(olderBoundDate, false),
    );
    if (keys.length > 0)
      await Promise.all([keys.map((key) => mutedUrls.delete(key))]);

    await tx.done;
    return keys.length;
  }
}
