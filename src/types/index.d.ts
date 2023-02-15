type valueOf<T> = T[keyof T];

type StorageKey = valueOf<typeof import('../popup/constants').STORAGE_KEY>;
