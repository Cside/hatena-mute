import sentry from '@sentry/react';
import { initializationArgs } from './base';

if (ENABLES_SENTRY) sentry.init(initializationArgs);
