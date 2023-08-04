import type { ErrorObject } from 'serialize-error';

import { deserializeError } from 'serialize-error';

type QuerySelectorParameters =
  | [element: HTMLElement, selector: string]
  | [selector: string];

export const $ = <T extends HTMLElement>(
  ...params: QuerySelectorParameters
) => {
  const [elementOrSelector, selector] = params;
  if (selector && elementOrSelector instanceof HTMLElement) {
    const result = (elementOrSelector as HTMLElement).querySelector<T>(
      selector,
    );
    if (!result) {
      const message = `${selector} is not found`;
      console.info(`${message}. targetElement: `, elementOrSelector);
      throw new Error(message);
    }
    return result;
  } else {
    const result = document.querySelector<T>(elementOrSelector as string);
    if (!result) throw new Error(`${elementOrSelector} is not found`);
    return result;
  }
};

export const $$ = <T extends HTMLElement>(
  ...params: QuerySelectorParameters
) => {
  const [elementOrSelector, selector] = params;
  return [
    ...(selector
      ? (elementOrSelector as HTMLElement).querySelectorAll<T>(selector)
      : document.querySelectorAll<T>(elementOrSelector as string)),
  ];
};

export const sendMessage = async (
  params: Parameters<typeof chrome.runtime.sendMessage>[1],
): Promise<unknown> => {
  try {
    const result:
      | {
          success: true;
          data?: unknown;
        }
      | {
          success: false;
          error: ErrorObject;
        } = await chrome.runtime.sendMessage(params);

    if (!result.success) {
      const prefix = 'Error occurred in background service worker.\n';
      if (result.error.message)
        result.error.message = prefix + result.error.message;
      if (result.error.stack) result.error.stack = prefix + result.error.stack;
      throw deserializeError(result.error);
    }
    return result.data;
  } catch (error) {
    if (error instanceof Error)
      error.message =
        'chrome.runtime.sendMessage() failed. Maybe the extension is updated but the content script is not reloaded.\n' +
        error.message;
    throw error;
  }
};
