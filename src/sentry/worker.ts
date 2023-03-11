import sentry from '@sentry/browser';
import { initializationArgs } from './base';

if (ENABLES_SENTRY) {
  // https://github.com/getsentry/sentry-javascript/issues/5289
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Sentry.WINDOW.document = {
    visibilityState: 'hidden',
    addEventListener: () => {},
  };
  sentry.init(initializationArgs);
}
