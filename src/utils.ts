import manifest from '../manifest.json';

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

export const getOrigin = () => {
  const origin = manifest.content_scripts[0]?.matches;
  if (!origin || !origin[0])
    throw new Error(`manifestJson.content_scripts[0].matches[0] is not found`);
  return origin[0];
};
