import { IndexedDb } from '../storage/IndexedDb';

const INTERVAL_MINUTES = 24 * 60; // 24 hours
const OLDER_THAN = 30 * 24 * 60 * 60 * 1000; // 30 days
const ALARM_NAME = 'delete-muted-entries';

const db = new IndexedDb();
db.open(); // eslint-disable-line @typescript-eslint/no-floating-promises

chrome.alarms.onAlarm.addListener(async () => {
  const now = new Date();
  console.info(`[deletion] Deletion started at ${now.toLocaleString('ja-JP')}`);

  await db.waitForConnection();
  const length = await db.mutedEntries.deleteAll({
    olderThan: new Date(Date.now() - OLDER_THAN),
  });

  console.info(`  [deletion] Deleted ${length} records`);

  const nextScheduled = new Date(now.getTime());
  nextScheduled.setMinutes(now.getMinutes() + INTERVAL_MINUTES);
  console.info(
    `  [deletion] Next scheduled: ${nextScheduled.toLocaleString('ja-JP')}`,
  );
});

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason !== chrome.runtime.OnInstalledReason.INSTALL) return;

  await chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: 0,
    periodInMinutes: INTERVAL_MINUTES,
  });
});
