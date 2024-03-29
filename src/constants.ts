export const ACTION_OF = {
  UPDATE_IS_EXTENSION_ENABLED: 'update-is-extension-enabled',
  UPDATE_MUTED_SITES: 'update-muted-sites',
  UPDATE_MUTED_WORDS: 'update-muted-words',
  GET_VISITED_MAP: 'get-visited-map',
  ADD_HISTORY: 'add-history',
  UPDATE_LIGHTENING_OPTIONS: 'update-lightening-options',
  ADD_MUTED_ENTRY: 'add-muted-entry',
  GET_MUTED_ENTRY_MAP: 'get-muted-entry-map',
} as const;

export const STORAGE_KEY_OF = {
  IS_EXTENSION_ENABLED: 'is-extension-enabled',
  MUTED_SITES: 'muted-sites',
  MUTED_WORDS: 'muted-words',
  LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED:
    'ligntens-entry-whose-comments-have-been-visited',
  LIGHTENS_VISITED_ENTRY: 'lightens-visited-entry',
} as const;

export const INDEXED_DB = {
  NAME: 'hatenaMute',
  VERSION: 1,
  OBJECT_STORE_OF: {
    MUTED_ENTRIES: {
      NAME: 'mutedEntries',
      KEY_PATH: 'url',
      INDEX_OF: {
        BY_CREATED: {
          NAME: 'by_created',
          PATH: 'created',
        },
      },
    },
  },
};
