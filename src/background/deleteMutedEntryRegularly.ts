import { MutedEntryDb } from '../EntryMuter/store';
const INTERVAL = 24 * 60; // minutes
const OLDER_THAN = 7 * 24 * 60; // minutes
const ALARM_NAME = 'delete-muted-entry';

chrome.alarms.onAlarm.addListener(async () => {
  const db = await MutedEntryDb.open();

  console.log(`deletion started at ${new Date().toLocaleString('ja-JP')}`);

  const length = await db.deleteAll({
    olderThan: new Date(Date.now() - OLDER_THAN * 60 * 1000),
  });
  db.close();

  console.info(`  deleted ${length} records`);
});

(async () => {
  await chrome.alarms.clear(ALARM_NAME);
  chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: 0,
    periodInMinutes: INTERVAL,
  });
})();
