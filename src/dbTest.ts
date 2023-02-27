// import { MutedEntryDb } from './EntryMuter/store';
//
// const db = await MutedEntryDb.open();
//
// const url = 'https://example.com/';

// await db.deletePast({ olderBoundDate: new Date() });
// console.log(await db.get(url));
// await db.put({ url, created: new Date() });

// setTimeout(async () => {
//   for (const n of [...Array(100_000).keys()]) {
//     console.log(n);
//     await db.put({ url: url + String(n), created: new Date() });
//   }
// }, 1000);
// console.log(await db.get(url));
