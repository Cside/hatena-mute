import * as sentry from '@sentry/browser';
import { ACTION_OF } from '../constants';
import { initSentry } from '../sentry';
import { EntryMuter } from './EntryMuter';
import { ExtensionEnabler } from './ExtensionEnabler';
import { VisitedEntryLightener } from './VisitedEntryLightener';
import { getEntries } from './entry';

if (!IS_FIREFOX) initSentry(sentry);

const rootElement = document.querySelector<HTMLElement>('.entrylist-wrapper');

if (rootElement) {
  const entries = getEntries();

  const extensionEnabler = new ExtensionEnabler({
    rootElement,
  });
  await extensionEnabler.initialize();

  const entryMuter = new EntryMuter({ entries });
  entryMuter.initialize();

  const visitedEntryLightener = new VisitedEntryLightener({
    entries,
    rootElement,
  });
  visitedEntryLightener.addClickListeners();

  // events from popup
  // TODO: await 後の addListener 、本来は bad design
  chrome.runtime.onMessage.addListener(async ({ type }: { type: string }) => {
    console.info(`action: ${type}`);

    switch (type) {
      case ACTION_OF.UPDATE_IS_EXTENSION_ENABLED:
        await extensionEnabler.update();
        break;

      case ACTION_OF.UPDATE_MUTED_SITES:
        await entryMuter.muteBySites();
        break;

      case ACTION_OF.UPDATE_MUTED_WORDS:
        await entryMuter.muteByWords();
        break;

      case ACTION_OF.UPDATE_LIGHTENING_OPTIONS:
        await visitedEntryLightener.lighten();
        break;

      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  });

  // sendMessage でエラーになるケースがあるので、敢えて floating promise にする
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  visitedEntryLightener.lighten();
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  entryMuter.mute();
}
