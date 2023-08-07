import { IndexedDb } from '../storage/IndexedDb';
import { $ } from '../utils';

const result = $('#result');
const clear = $('#clear');

const db = new IndexedDb();
await db.open();
const records = await db.mutedEntries.getAll();

if (records.length > 0)
  result.innerHTML =
    `
    <table style="width: 800px;">
      <tbody>` +
    records
      .reverse()
      .map(
        (record) => `
          <tr>
            <td style="width: 120px; vertical-align: top;">
              ${record.created.toLocaleString('ja-JP')}
            </td>
            <td>
              <a style="word-break: break-all;" href="${
                record.url
              }" target="_blank">${record.url}</a>
            </td>
          </tr>`,
      )
      .join('\n') +
    ` </tbody>
    </table>`;

clear.addEventListener('click', async (event) => {
  event.preventDefault();

  await db.mutedEntries.clear();
  result.innerHTML = '';
});
