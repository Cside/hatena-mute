import * as deleteMutedEntryRegularly from './deleteMutedEntryRegularly';
import * as handleMessages from './handleMessages';

import { initSentry } from '../sentry';

(async () => {
  console.log('init sentry');

  await initSentry({ type: 'browser' });
  console.log(1);

  await deleteMutedEntryRegularly.execute();
  console.log(2);

  handleMessages.execute();
  console.log(3);
})();
