import { STORAGE_KEY_OF } from './constants';
import { storage } from './storage';

test(STORAGE_KEY_OF.LIGHTENS_VISITED_ENTRY, async () => {
  expect(await storage.get(STORAGE_KEY_OF.LIGHTENS_VISITED_ENTRY)).toBe(false);
  await storage.set(STORAGE_KEY_OF.LIGHTENS_VISITED_ENTRY, true);
  expect(await storage.get(STORAGE_KEY_OF.LIGHTENS_VISITED_ENTRY)).toBe(true);
});

test(
  STORAGE_KEY_OF.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED,
  async () => {
    expect(
      await storage.get(
        STORAGE_KEY_OF.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED,
      ),
    ).toBe(false);
    await storage.set(
      STORAGE_KEY_OF.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED,
      true,
    );
    expect(
      await storage.get(
        STORAGE_KEY_OF.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED,
      ),
    ).toBe(true);
  },
);
