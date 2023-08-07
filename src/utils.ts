import type { ErrorObject } from 'serialize-error';

import { deserializeError } from 'serialize-error';
import { MessageParameters } from './types';

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

const addPrefixToError = (prefix: string, error: Error) => {
  error.message = prefix + error.message;
  error.stack = prefix + error.stack;
};

const SEND_MESSAGE_TIMEOUT = 500;

export const sendMessage = async (
  params: MessageParameters,
): Promise<unknown> => {
  const startTime = new Date().getTime();

  try {
    const result:
      | {
          success: true;
          data?: unknown;
        }
      | {
          success: false;
          error: ErrorObject;
        } = await Promise.race([
      chrome.runtime.sendMessage(params),
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Timeout of ${SEND_MESSAGE_TIMEOUT} ms exceeded.`));
        }, SEND_MESSAGE_TIMEOUT);
      }),
    ]);

    if (!result.success) {
      console.info(
        `[message: ${params.type}] Failed in ${
          new Date().getTime() - startTime
        } ms`,
      );
      const error = deserializeError(result.error);
      addPrefixToError('Error occurred in background service worker.\n', error);
      throw error;
    }
    console.info(
      `[message: ${params.type}] Succeeded in ${
        new Date().getTime() - startTime
      } ms`,
    );
    return result.data;
  } catch (error) {
    console.info(
      `[message: ${params.type}] Failed in ${
        new Date().getTime() - startTime
      } ms`,
    );
    if (error instanceof Error) {
      let prefix = `chrome.runtime.sendMessage({ type: ${params.type} }) failed.\n`;
      if (error.message.includes('Extension context invalidated.'))
        prefix =
          prefix +
          `Maybe the extension is updated but the content script is not reloaded.\n`;
      addPrefixToError(prefix, error);
    }
    throw error;
  }
};
