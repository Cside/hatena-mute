import { ACTION, STORAGE_KEY } from './constants';
import { storage } from './storage';

type valueOf<T> = T[keyof T];

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type Action = valueOf<typeof ACTION>;

export type StorageKey = valueOf<typeof STORAGE_KEY>;

export type Entry = {
  element: HTMLElement;
  titleLink: HTMLAnchorElement;
  commentsLinks: HTMLAnchorElement[];
  description?: HTMLElement;
  domain: HTMLElement;
};

export type MutedEntry = {
  url: string;
  created: Date;
};

export type IndexedDb = Awaited<ReturnType<typeof storage.indexedDb.open>>;
