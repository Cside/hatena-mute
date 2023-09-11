import type { BrowserOptions } from '@sentry/browser';
import { CaptureConsole } from '@sentry/integrations';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = (
  sentry: {
    init(args: BrowserOptions): void;
  },
  { worker }: { worker: boolean } = { worker: false },
) => {
  if (!ENABLES_SENTRY) return;

  if (worker)
    // https://github.com/getsentry/sentry-javascript/issues/5289
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sentry.WINDOW.document = {
      visibilityState: 'hidden',
      addEventListener: () => {},
    };

  sentry.init({
    dsn: import.meta.env.DEV
      ? 'https://7cc31eed61784a179cb48897dd747a3b@o49171.ingest.sentry.io/4504761065734144'
      : 'https://35a77cb42ef64cc3a64e60d13ea9894a@o49171.ingest.sentry.io/4504761158074368',
    release: chrome.runtime.getManifest().version,
    integrations: [new BrowserTracing(), new CaptureConsole({ levels: ['warn', 'error'] })],
  });
};
