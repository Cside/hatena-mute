import type { ErrorObject } from 'serialize-error';
import type { MessageParameters } from './types';

import pRetry, { AbortError } from 'p-retry';
import { deserializeError } from 'serialize-error';

const TIMEOUT = (attemptNumber: number) => (attemptNumber + 2) * 100; // 300, 400, 500 ...
const RETRIES = 3; // 1st attempt + retries なので、実際は最大で retries + 1 回試行される
const INTERVAL = 50;

const addPrefixToError = (prefix: string, error: Error) => {
  error.message = prefix + error.message;
  error.stack = prefix + error.stack;
};

const _sendMessage = async (
  attemptNumber: number,
  params: MessageParameters,
) => {
  const startTime = new Date().getTime();
  const attempt = attemptNumber >= 2 ? `(${attemptNumber})` : '';
  const timeout = TIMEOUT(attemptNumber);

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
      // 稀に、bg 側で sendResponse() を呼んだにも関わらず、promise が解決されないことがあるため、苦肉の timeout
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Timeout of ${timeout} ms exceeded.`));
        }, timeout);
      }),
    ]);
    if (!result.success) {
      const error = deserializeError(result.error);
      addPrefixToError('Error occurred in background service worker.\n', error);
      throw new AbortError(error);
    }
    console.info(
      `[message: ${params.type}${attempt}] Succeeded in ${
        new Date().getTime() - startTime
      } ms`,
    );
    return result.data;
  } catch (error) {
    console.info(
      `[message: ${params.type}${attempt}] ❌Failed in ${
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

export const sendMessage = async (
  params: MessageParameters,
): Promise<unknown> =>
  await pRetry(
    (attemptNumber: number) => {
      return _sendMessage(attemptNumber, params);
    },
    // https://github.com/sindresorhus/p-retry#options
    {
      retries: RETRIES,
      minTimeout: INTERVAL, // default: 1,000
      maxTimeout: INTERVAL, // default: infinity
      onFailedAttempt: (error) => console.error(error),
    },
  );
