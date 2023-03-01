import { userOption } from '../userOption';
const INTERVAL = 24 * 60; // minutes (24 hours)
const OLDER_THAN = 4 * 24 * 60; // minutes (4 days)
const ALARM_NAME = 'delete-muted-entries';

chrome.alarms.onAlarm.addListener(async () => {
  const now = new Date();
  const length = await userOption.indexedDb.execute(async (db) => {
    console.info(`deletion started at ${now.toLocaleString('ja-JP')}`);

    return await db.deleteAll({
      olderThan: new Date(Date.now() - OLDER_THAN * 60 * 1000),
    });
  });

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
