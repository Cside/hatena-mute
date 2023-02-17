export const EVENT_KEY = {
  MUTED_URLS: 'muted-urls',
  MUTED_WORDS: 'muted-words',
} as const;

export const STORAGE_KEY = {
  MUTED_URLS: EVENT_KEY.MUTED_URLS,
  MUTED_WORDS: EVENT_KEY.MUTED_WORDS,
} as const;
