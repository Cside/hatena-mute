import zip from 'lodash.zip';
import type { IDB } from '../../types';

export class MutedEntries {
  db: IDB;

  constructor({ db }: { db: IDB }) {
    this.db = db;
  }
  async getMap(urls: string[]) {
    const tx = this.db.transaction(this.objectStore.name, 'readonly');
    const objectStore = tx.store;

    return zip(
      urls,
      await Promise.all(
        urls.map(async (url) => !!(await objectStore.get(url))),
      ),
    ) as [string, boolean][];
  }

  // debug usage only
  async getAll<T>(): Promise<T[]> {
    const tx = this.db.transaction(this.objectStore.name, 'readonly');
    const objectStore = tx.store;
    const records = await objectStore.getAll();
    await tx.done;

    return records;
  }

  async put(url: string) {
    const tx = this.db.transaction(this.objectStore.name, 'readwrite');
    const objectStore = tx.store;
    await objectStore.put({ url, created: new Date() });

    await tx.done;
  }

  async deleteAll({ olderThan }: { olderThan: Date }) {
    const tx = this.db.transaction(this.objectStore.name, 'readwrite');

    const objectStore = tx.store;

    const createdIndex = objectStore.index(this.objectStore.indexName);
    const keys = await createdIndex.getAllKeys(
      IDBKeyRange.upperBound(olderThan, false),
    );
    if (keys.length > 0)
      await Promise.all([keys.map((key) => objectStore.delete(key))]);

    await tx.done;
    return keys.length;
  }
}
