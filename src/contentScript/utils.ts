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
