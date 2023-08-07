import * as sentry from '@sentry/browser';
import { initSentry } from '../sentry';
import './deleteMutedEntryRegularly';
import './handleMessages';

if (!IS_FIREFOX) initSentry(sentry, { worker: true });
