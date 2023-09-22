import type { ErrorObject } from 'serialize-error';
import type { MessageParameters } from './types';

import pRetry, { AbortError } from 'p-retry';
import { stackWithCauses } from 'pony-cause';
import { deserializeError } from 'serialize-error';
import { ACTION_OF } from './constants';

export const TIMEOUT = (attemptNumber: number) => {
  return attemptNumber * 1000 + (attemptNumber === 1 ? 0 : 500);
};
const RETRIES = 3; // 1st attempt + retries なので、実際は最大で retries + 1 回試行される
const INTERVAL = 50;
const ERROR_PREFIX = (type: string) => `chrome.runtime.sendMessage({ type: ${type} }) failed.`;

const _sendMessageToBg = async (attemptNumber: number, params: MessageParameters) => {
  const startTime = Date.now();
  const attempt = attemptNumber >= 2 ? `(${attemptNumber})` : '';
  const timeoutDuration = TIMEOUT(attemptNumber);
  let isTimeOuted = false;

  try {
    const result:
      | {
          success: true;
          data: unknown;
        }
      | {
          success: false;
          error: ErrorObject;
        } = await Promise.race([
      chrome.runtime.sendMessage(params).then((result) => {
        if (isTimeOuted)
          log(Date.now() - startTime, attemptNumber, {
            type: params.type,
            result,
          });
        return result;
      }),
      // 稀に、bg 側で sendResponse() を呼んだにも関わらず、promise が解決されないことがあるため、苦肉の timeout
      new Promise((_, reject) => {
        setTimeout(() => {
          isTimeOuted = true;
          reject(new Error(`Timeout of ${timeoutDuration} ms exceeded.`));
        }, timeoutDuration);
      }),
    ]);
    if (!result.success) {
      const error = deserializeError(result.error);
      throw new AbortError(
        new Error(
          ERROR_PREFIX(params.type) + '\nError occurred in the background service worker.',
          { cause: error },
        ),
      );
    }
    console.info(
      `[message: ${params.type}${attempt}] Succeeded in ${Date.now() - startTime} ms`,
    );
    return result.data;
  } catch (error) {
    console.info(
      `[message: ${params.type}${attempt}] ❌Failed in ${Date.now() - startTime} ms`,
    );
    if (error instanceof AbortError || !(error instanceof Error)) throw error;

    const prefix = ERROR_PREFIX(params.type);
    // 拡張機能が更新されたのに、content script が reload されていない
    // 多分 Chrome 特有のエラーメッセージ（ Firefox は開発中のアドオンを更新するとページが強制リロードされるため再現不可）
    if (error.message.includes('Extension context invalidated.')) {
      if (confirm('拡張機能が更新されたため、処理に失敗しました。\nページを再読み込みします。'))
        setTimeout(() => location.reload(), 0);

      throw new AbortError(
        new Error(
          prefix + `\nMaybe the extension is updated but the content script is not reloaded.`,
          { cause: error },
        ),
      );
    }
    throw new Error(prefix, { cause: error });
  }
};

export const sendMessageToBg = async (params: MessageParameters): Promise<unknown> => {
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
    // 4 回全部失敗した場合
    // Chrome が console に cause を出力してくれるようになったら消す
    if (error instanceof Error) console.error(stackWithCauses(error));
    throw error;
  }
};

// log ========================================
// TODO: 上でも定義してるので、後で共通化してもいいかも

type MessageData<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: ErrorObject;
    };

type MessageResult =
  | {
      type: typeof ACTION_OF.GET_VISITED_MAP;
      result: MessageData<[string, boolean][]>;
    }
  | {
      type: typeof ACTION_OF.ADD_HISTORY;
      result: MessageData<undefined>;
    }
  | {
      type: typeof ACTION_OF.ADD_MUTED_ENTRY;
      result: MessageData<IDBValidKey>;
    }
  | {
      type: typeof ACTION_OF.GET_MUTED_ENTRY_MAP;
      result: MessageData<[string, boolean][]>;
    };

function log(elapsed: number, attemptNumber: number, { type, result }: MessageResult) {
  let message =
    `[message: ${type}] Too long processing in ${elapsed} ms. ` +
    `attempt: ${attemptNumber}, ` +
    `success: ${result.success}, ` +
    `path: ${location.pathname}, ` +
    `bytes: ${new Blob([JSON.stringify(result)]).size}`;
  if (
    result.success === true &&
    (type === ACTION_OF.GET_VISITED_MAP || type === ACTION_OF.GET_MUTED_ENTRY_MAP)
  )
    message += `, arrayLength: ${result.data.length}`;

  console.error(message);
}
