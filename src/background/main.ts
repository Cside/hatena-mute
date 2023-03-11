import '../sentry/worker';
import * as deleteMutedEntryRegularly from './deleteMutedEntryRegularly';
import * as handleMessages from './handleMessages';

(async () => {
  await deleteMutedEntryRegularly.run();
  handleMessages.run();
})();
