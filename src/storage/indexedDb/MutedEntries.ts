import * as idb from 'idb';
import zip from 'lodash.zip';
import { INDEXED_DB } from '../../constants';
import { MutedEntry } from '../../types';

const OBJECT_SCHEME_NAME = INDEXED_DB.OBJECT_STORE_OF.MUTED_ENTRIES.NAME;
const INDEX_BY_CREATED =
  INDEXED_DB.OBJECT_STORE_OF.MUTED_ENTRIES.INDEX_OF.BY_CREATED;

export class MutedEntries {
  db: idb.IDBPDatabase;

  constructor({ db }: { db: idb.IDBPDatabase }) {
    this.db = db;
  }
  async getMap(urls: string[]) {
    return zip(
      urls,
      await Promise.all(
        urls.map(async (url) => !!(await this.db.get(OBJECT_SCHEME_NAME, url))),
      ),
    ) as [string, boolean][];
  }

  // テーブルが存在しない時や、keyPath の値が不正だったときくらいしかコケない。そのときは例外が投げられる
  async put({ url, created = new Date() }: { url: string; created?: Date }) {
    return await this.db.put(OBJECT_SCHEME_NAME, { url, created });
  }

  async deleteAll({ olderThan }: { olderThan: Date }) {
    const keys = await this.db.getAllKeysFromIndex(
      OBJECT_SCHEME_NAME,
      'by_created',
      IDBKeyRange.upperBound(olderThan, false),
    );
    await Promise.all([
      keys.map((key) => this.db.delete(OBJECT_SCHEME_NAME, key)),
    ]);
    return keys.length;
  }

  // ========================================
  // testing usage only

  async get(url: string): Promise<MutedEntry | undefined> {
    return await this.db.get(OBJECT_SCHEME_NAME, url);
  }

  async getAllKeys() {
    return await this.db.getAllKeys(OBJECT_SCHEME_NAME);
  }

  // ========================================
  // debug usage only

  async getAll(): Promise<MutedEntry[]> {
    return await this.db.getAllFromIndex(
      OBJECT_SCHEME_NAME,
      INDEX_BY_CREATED.NAME,
    );
  }

  // ========================================
  // testing and debug usage only

  async clear() {
    return await this.db.clear(OBJECT_SCHEME_NAME);
  }
}
