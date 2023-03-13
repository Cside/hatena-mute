type valueOf<T> = T[keyof T];
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

type Action = valueOf<typeof import('../constants').ACTION>;

type StorageKey = valueOf<typeof import('../constants').STORAGE_KEY>;

type Entry = {
  element: HTMLElement;
  titleLink: HTMLAnchorElement;
  commentsLinks: HTMLAnchorElement[];
  description?: HTMLElement;
  domain: HTMLElement;
};

declare const ENABLES_SENTRY: boolean;
declare const IS_FIREFOX: boolean;

interface Sentry {
  init(args: typeof import('@sentry/browser').BrowserOptions): void;
}
