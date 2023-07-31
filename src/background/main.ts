import * as sentry from '@sentry/browser';
import { initSentry } from '../sentry';
import * as deleteMutedEntryRegularly from './deleteMutedEntryRegularly';
import * as handleMessages from './handleMessages';

import { storage } from '../storage';

if (!IS_FIREFOX) initSentry(sentry, { worker: true });

(async () => {
  const db = await storage.indexedDb.open();

  deleteMutedEntryRegularly.run(db);
  handleMessages.run(db);
})();
