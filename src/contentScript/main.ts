import * as sentry from '@sentry/browser';
import { ACTION } from '../constants';
import { initSentry } from '../sentry';
import { getEntries } from './entry';
import { EntryMuter } from './EntryMuter';
import { VisitedEntryLightener } from './VisitedEntryLightener';

initSentry(sentry);

const rootElement = document.querySelector<HTMLElement>('.entrylist-wrapper');

if (rootElement) {
  const entries = getEntries();

  const entryMuter = new EntryMuter({ entries });
  await entryMuter.initialize();

  const visitedEntryLightener = new VisitedEntryLightener({
    entries,
    rootElement,
  });
  visitedEntryLightener.addClickListeners();

  chrome.runtime.onMessage.addListener(async ({ type }: { type: string }) => {
    console.info(`action: ${type}`);

    switch (type) {
      case ACTION.UPDATE_MUTED_SITES:
        await entryMuter.muteBySites();
        break;

      case ACTION.UPDATE_MUTED_WORDS:
        await entryMuter.muteByWords();
        break;
      case ACTION.UPDATE_LIGHTENING_OPTIONS:
        await visitedEntryLightener.lighten();
        break;

      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  });

  await visitedEntryLightener.lighten();
  await entryMuter.mute();
}
