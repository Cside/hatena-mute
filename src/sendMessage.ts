import type { ErrorObject } from 'serialize-error';
import type { MessageParameters } from './types';

import pRetry, { AbortError } from 'p-retry';
import { stackWithCauses } from 'pony-cause';
import { deserializeError } from 'serialize-error';

export const TIMEOUT = (attemptNumber: number) => attemptNumber * 200 + 300; // 500, 700, 900, ...
const RETRIES = 3; // 1st attempt + retries なので、実際は最大で retries + 1 回試行される
const INTERVAL = 50;
const ERROR_PREFIX = (type: string) =>
  `chrome.runtime.sendMessage({ type: ${type} }) failed.`;

const _sendMessageToBg = async (
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
      throw new AbortError(
        new Error(
          ERROR_PREFIX(params.type) +
            '\nError occurred in the background service worker.',
          { cause: error },
        ),
      );
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
    if (error instanceof AbortError || !(error instanceof Error)) throw error;

    const prefix = ERROR_PREFIX(params.type);
    // 拡張機能が更新されたのに、content script が reload されていない
    // 多分 Chrome 特有のエラーメッセージ（ Firefox は開発中のアドオンを更新するとページが強制リロードされるため再現不可）
    if (error.message.includes('Extension context invalidated.')) {
      if (
        confirm(
          '拡張機能が更新されたため、処理に失敗しました。\nページを再読み込みします。',
        )
      )
        setTimeout(() => location.reload(), 0);

      throw new AbortError(
        new Error(
          prefix +
            `\nMaybe the extension is updated but the content script is not reloaded.`,
          { cause: error },
        ),
      );
    }
    throw new Error(prefix, { cause: error });
  }
};

export const sendMessageToBg = async (
  params: MessageParameters,
): Promise<unknown> => {
  try {
    return await pRetry(
      (attemptNumber: number) => {
        return _sendMessageToBg(attemptNumber, params);
      },
      // https://github.com/sindresorhus/p-retry#options
      {
        retries: RETRIES,
        minTimeout: INTERVAL, // default: 1,000
        maxTimeout: INTERVAL, // default: infinity
        onFailedAttempt: (error) =>
          // Chrome が console に cause を出力してくれるようになったら消す
          console.error(stackWithCauses(error)),
      },
    );
  } catch (error) {
    // Chrome が console に cause を出力してくれるようになったら消す
    if (error instanceof Error) console.error(stackWithCauses(error));
    throw error;
  }
};
