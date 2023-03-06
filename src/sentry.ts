import { CaptureConsole as CaptureConsoleIntegration } from '@sentry/integrations';
import { BrowserTracing } from '@sentry/tracing';

type Type = 'browser' | 'react';

let TYPE: Type = 'browser';

const sentry = async () =>
  await (TYPE === 'browser'
    ? import('@sentry/browser')
    : import('@sentry/react'));

export const initSentry = async ({ type }: { type: Type }) => {
  if (!ENABLES_SENTRY) return;

  TYPE = type;

  (await sentry()).init({
    dsn: import.meta.env.DEV
      ? 'https://7cc31eed61784a179cb48897dd747a3b@o49171.ingest.sentry.io/4504761065734144'
      : 'https://35a77cb42ef64cc3a64e60d13ea9894a@o49171.ingest.sentry.io/4504761158074368',
    release: chrome.runtime.getManifest().version,
    integrations: [
      new BrowserTracing(),
      new CaptureConsoleIntegration({ levels: ['warn', 'error'] }),
    ],
  });
};
