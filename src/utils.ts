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
      console.error({ targetElement: elementOrSelector });
      throw new Error(`${selector} is not found`);
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