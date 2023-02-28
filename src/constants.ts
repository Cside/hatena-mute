export const ACTION = {
  UPDATE_MUTED_SITES: 'update-muted-sites',
  UPDATE_MUTED_WORDS: 'update-muted-words',
  GET_VISITED_MAP: 'get-visited-map',
  UPDATE_LIGHTENING_OPTIONS: 'update-lightening-options',
  ADD_MUTED_ENTRY: 'add-muted-entry',
  GET_MUTED_ENTRY_MAP: 'get-muted-entry-map',
} as const;

export const STORAGE_KEY = {
  MUTED_SITES: 'muted-sites',
  MUTED_WORDS: 'muted-words',
  LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED:
    'ligntens-entry-whose-comments-have-been-visited',
  LIGHTENS_VISITED_ENTRY: 'lightens-visited-entry',
} as const;

export const INDEXED_DB_OPTIONS = {
  db: {
    name: 'hatenaMute',
    version: 1,
  },
  objectStore: {
    name: 'mutedEntries',
    keyPath: 'url',
    indexName: 'by_created',
    indexPath: 'created',
  },
};
