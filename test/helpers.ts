import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const userEventSetup = (
  options: Parameters<(typeof userEvent)['setup']>[0] = {},
): ReturnType<(typeof userEvent)['setup']> => {
  // https://testing-library.com/docs/user-event/options
  return userEvent.setup(options);
};

export const findBySelector = async <T extends HTMLElement>(
  selector: string,
) => {
  return await waitFor<T>(() => {
    const elem = document.querySelector<T>(selector);
    if (!elem) throw new Error(`Element (${selector}) is not found`);
    return elem;
  });
};

export const $ = <T extends HTMLElement>(selector: string) => {
  const elem = document.querySelector<T>(selector);
  if (!elem) throw new Error(`Element (${selector}) is not found`);
  return elem;
};
