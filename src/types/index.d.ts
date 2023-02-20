type valueOf<T> = T[keyof T];
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

type Action = valueOf<typeof import('../constants').ACTION>;

type StorageKey = valueOf<typeof import('../constants').STORAGE_KEY>;
type MutedListsStorageKey =
  typeof import('../userOption/mutedList').STORAGE_KEYS[number];
type UserOptionsStorageKey =
  keyof typeof import('../userOption/index').SETTINGS;

type Entry = {
  element: HTMLElement;
  titleLink: HTMLAnchorElement;
  commentsLink: HTMLAnchorElement;
  description?: HTMLElement;
  domain: HTMLElement;
};
