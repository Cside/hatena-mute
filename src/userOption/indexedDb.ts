import * as idb from 'idb';
import zip from 'lodash.zip';
import { INDEXED_DB_OPTIONS } from '../constants';

type ObjectStore = {
  name: string;
  keyPath: string;
  indexName: string;
  indexPath: string;
};

type Db = {
  name: string;
  version: number;
};

export class indexedDb {
  _db: Awaited<ReturnType<typeof idb.openDB>> | null = null;

  objectStore: ObjectStore = {
    name: '',
    keyPath: '',
    indexName: '',
    indexPath: '',
  };

  get plainDb() {
    const db = this._db;
    if (!db) throw new Error(`open() is not called yet`);
    return db;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async execute(fn: (db: indexedDb) => Promise<any>) {
    const db = await indexedDb.openDb(INDEXED_DB_OPTIONS);
    const result = await fn(db);
    db.close();
    return result;
  }

  /** コンストラクタは使わず、このクラスメソッドでインスタンスを作成する */
  static async openDb({
    db,
    objectStore,
  }: {
    db: Db;
    objectStore: ObjectStore;
  }) {
    const _this = new indexedDb();
    _this.objectStore = objectStore;

    _this._db = await idb.openDB(db.name, db.version, {
      upgrade(db) {
        const store = db.createObjectStore(objectStore.name, {
          keyPath: objectStore.keyPath,
        });
        store.createIndex(objectStore.indexName, objectStore.indexPath);
      },
      blocked(currentVersion, blockedVersion) {
        console.error(
          `Older versions of the database open on the origin, so this version cannot open`,
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
    return _this;
  }

  async getMap(urls: string[]) {
    const tx = this.plainDb.transaction(this.objectStore.name, 'readonly');
    const objectStore = tx.objectStore(this.objectStore.name);

    return zip(
      urls,
      await Promise.all(
        urls.map(async (url) => !!(await objectStore.get(url))),
      ),
    ) as [string, boolean][];
  }

  // debug usage only
  async getAll() {
    const tx = this.plainDb.transaction(this.objectStore.name, 'readonly');
    const objectStore = tx.objectStore(this.objectStore.name);
    const records = await objectStore.getAll();
    await tx.done;

    return records;
  }

  async put(url: string) {
    const tx = this.plainDb.transaction(this.objectStore.name, 'readwrite');
    const objectStore = tx.objectStore(this.objectStore.name);
    await objectStore.put({ url, created: new Date() });

    await tx.done;
  }

  async deleteAll({ olderThan }: { olderThan: Date }) {
    const tx = this.plainDb.transaction(this.objectStore.name, 'readwrite');

    const objectStore = tx.objectStore(this.objectStore.name);

    const createdIndex = objectStore.index(this.objectStore.indexName);
    const keys = await createdIndex.getAllKeys(
      IDBKeyRange.upperBound(olderThan, false),
    );
    if (keys.length > 0)
      await Promise.all([keys.map((key) => objectStore.delete(key))]);

    await tx.done;
    return keys.length;
  }

  close() {
    this.plainDb.close();
  }
}
