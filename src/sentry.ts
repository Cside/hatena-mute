import { CaptureConsole as CaptureConsoleIntegration } from '@sentry/integrations';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = () => {
  if (ENABLES_SENTRY)
    Sentry.init({
      dsn: import.meta.env.DEV
        ? 'https://7cc31eed61784a179cb48897dd747a3b@o49171.ingest.sentry.io/4504761065734144'
        : 'https://35a77cb42ef64cc3a64e60d13ea9894a@o49171.ingest.sentry.io/4504761158074368',
      release: chrome.runtime.getManifest().version,
      integrations: [
        new BrowserTracing(),
        new CaptureConsoleIntegration({
          levels: ['warn', 'error'],
        }),
      ],
    });
};
