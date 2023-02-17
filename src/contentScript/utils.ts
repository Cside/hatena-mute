type QuerySelectorParameters =
  | [element: HTMLElement, selector: string]
  | [selector: string];

export const $ = <T extends HTMLElement>(
  ...params: QuerySelectorParameters
) => {
  const [elementOrSelector, selector] = params;
  const result = selector
    ? (elementOrSelector as HTMLElement).querySelector<T>(selector)
    : document.querySelector<T>(elementOrSelector as string);

  if (!result) throw new Error(`${selector ?? elementOrSelector} is not found`);
  return result;
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

export const createElementFromString = <T = HTMLElement>(
  htmlString: string,
) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild as T;
};

const WAIT_FOR_TIMEOUT = 10_000;

export const waitFor = async (fn: () => boolean) => {
  const interval = 100;
  return new Promise((resolve) => {
    if (fn()) {
      resolve(undefined);
    }

    let elapsed = 0;
    const id = setInterval(() => {
      elapsed += interval;
      if (elapsed >= WAIT_FOR_TIMEOUT) {
        console.error(`Timeout`);
        clearInterval(id);
        return;
      }
      if (fn()) {
        resolve(undefined);
        clearInterval(id);
      }
    }, interval);
  });
};
