import type { IndexedDb } from '../types';

const INTERVAL_MINUTES = 24 * 60; // 24 hours
const OLDER_THAN = 30 * 24 * 60 * 60 * 1000; // 30 days
const ALARM_NAME = 'delete-muted-entries';

export const run = (db: IndexedDb) => {
  chrome.alarms.onAlarm.addListener(async () => {
    const now = new Date();
    console.info(`deletion started at ${now.toLocaleString('ja-JP')}`);

    const length = await db.mutedEntries.deleteAll({
      olderThan: new Date(Date.now() - OLDER_THAN),
    });

    console.info(`  deleted ${length} records`);

    const nextScheduled = new Date(now.getTime());
    nextScheduled.setMinutes(now.getMinutes() + INTERVAL_MINUTES);
    console.info(`  next scheduled: ${nextScheduled.toLocaleString('ja-JP')}`);
  });

  chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason !== chrome.runtime.OnInstalledReason.INSTALL) return;

    await chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 0,
      periodInMinutes: INTERVAL_MINUTES,
    });
  });
};
