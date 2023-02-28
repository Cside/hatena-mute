import * as idb from 'idb';

type ObjectStore = {
  name: string;
  keyPath: string;
  indexName: string;
  indexPath: string;
};

type Record = {
  url: string;
  created: Date;
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

  async get(url: string) {
    const tx = this.plainDb.transaction(this.objectStore.name, 'readonly');

    const objectStore = tx.objectStore(this.objectStore.name);
    const record = await objectStore.get(url);

    return record ? (record as Record) : undefined;
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
