import { storage } from '../storage';
import { $ } from '../utils';

const result = $('#result');
const reset = $('#reset');

const db = await storage.indexedDb.open();

result.innerText = JSON.stringify(
  (await db.mutedEntries.getAll())
    .reverse()
    .map(
      (record) => record.created.toLocaleString('ja-JP') + '    ' + record.url,
    ),
  null,
  4,
);

reset.addEventListener('click', () => alert(3));
