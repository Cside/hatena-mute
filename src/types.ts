import * as idb from 'idb';
import { ACTION, STORAGE_KEY } from './constants';

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

export type IDB = Awaited<ReturnType<typeof idb.openDB>>;
