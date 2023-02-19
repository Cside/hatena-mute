export const ACTION = {
  UPDATE_MUTED_SITES: 'update-muted-sites',
  UPDATE_MUTED_WORDS: 'update-muted-words',
  GET_VISITED_MAP: 'get-visited-map',
} as const;

export const STORAGE_KEY = {
  MUTED_SITES: 'muted-sites',
  MUTED_WORDS: 'muted-words',
  REGARDS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED_AS_VISITED:
    'regards-entry-whose-comments-have-been-visited-as-visited',
  LIGHTENS_VISITED_ENTRY: 'lightens-visited-entry',
} as const;
