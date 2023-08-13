import { ACTION_OF, STORAGE_KEY_OF } from './constants';

type valueOf<T> = T[keyof T];

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type Action = valueOf<typeof ACTION_OF>;

export type StorageKey = valueOf<typeof STORAGE_KEY_OF>;

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

export type MessageParameters =
  | {
      type: typeof ACTION_OF.GET_VISITED_MAP;
      payload: { urls: string[] };
    }
  | {
      type: typeof ACTION_OF.ADD_HISTORY;
      payload: { url: string };
    }
  | {
      type: typeof ACTION_OF.ADD_MUTED_ENTRY;
      payload: { url: string };
    }
  | {
      type: typeof ACTION_OF.GET_MUTED_ENTRY_MAP;
      payload: { urls: string[] };
    };
