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
