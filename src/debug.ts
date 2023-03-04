import { INDEXED_DB_OPTIONS } from './constants';
import { userOption } from './userOption';

const result = document.getElementById('result');
if (!result) throw new Error('#result is not found');

const db = await userOption.indexedDb.openDb(INDEXED_DB_OPTIONS);
result.innerText = JSON.stringify(
  (await db.getAll<{ url: string; created: Date }>())
    .reverse()
    .map(
      (record) => record.created.toLocaleString('ja-JP') + '    ' + record.url,
    ),
  null,
  4,
);
