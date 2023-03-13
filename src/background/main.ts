import * as sentry from '@sentry/browser';
import { initSentry } from '../sentry';
import * as deleteMutedEntryRegularly from './deleteMutedEntryRegularly';
import * as handleMessages from './handleMessages';

if (!IS_FIREFOX) initSentry(sentry, { worker: true });

(async () => {
  await deleteMutedEntryRegularly.run();
  handleMessages.run();
})();
