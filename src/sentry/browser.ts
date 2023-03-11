import sentry from '@sentry/browser';
import { initializationArgs } from './base';

if (ENABLES_SENTRY) sentry.init(initializationArgs);
