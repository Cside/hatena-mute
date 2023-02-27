import { INDEXED_DB_OPTIONS } from '../constants';
import { MutedEntryDb } from '../EntryMuter/store';
// const INTERVAL = 24 * 60; // minutes
const INTERVAL = 60; // minutes
const OLDER_THAN = 7 * 24 * 60; // minutes
const ALARM_NAME = 'delete-muted-entry';

chrome.alarms.onAlarm.addListener(async () => {
  const db = await MutedEntryDb.openDb(INDEXED_DB_OPTIONS);
  const now = new Date();

  console.info(`deletion started at ${now.toLocaleString('ja-JP')}`);

  const length = await db.deleteAll({
    olderThan: new Date(Date.now() - OLDER_THAN * 60 * 1000),
  });
  db.close();

  console.info(`  deleted ${length} records`);

  const nextScheduled = new Date(now.getTime());
  nextScheduled.setMinutes(now.getMinutes() + INTERVAL);
  console.info(`  next scheduled: ${nextScheduled.toLocaleString('ja-JP')}`);
});

(async () => {
  await chrome.alarms.clear(ALARM_NAME);
  chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: 0,
    periodInMinutes: INTERVAL,
  });
})();
