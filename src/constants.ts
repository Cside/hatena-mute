export const ACTION = {
  UPDATE_MUTED_SITES: 'update-muted-sites',
  UPDATE_MUTED_WORDS: 'update-muted-words',
  GET_VISITED_MAP: 'get-visited-map',
  UPDATE_LIGHTENING_OPTIONS: 'update-lightening-options',
} as const;

export const STORAGE_KEY = {
  MUTED_SITES: 'muted-sites',
  MUTED_WORDS: 'muted-words',
  LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED:
    'ligntens-entry-whose-comments-have-been-visited',
  LIGHTENS_VISITED_ENTRY: 'lightens-visited-entry',
} as const;
