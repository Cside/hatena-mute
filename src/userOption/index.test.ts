import { STORAGE_KEY } from '../constants';
import { userOption } from './';

test(STORAGE_KEY.LIGHTENS_VISITED_ENTRY, async () => {
  expect(await userOption.get(STORAGE_KEY.LIGHTENS_VISITED_ENTRY)).toBe(false);
  await userOption.set(STORAGE_KEY.LIGHTENS_VISITED_ENTRY, true);
  expect(await userOption.get(STORAGE_KEY.LIGHTENS_VISITED_ENTRY)).toBe(true);
});

test(STORAGE_KEY.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED, async () => {
  expect(
    await userOption.get(
      STORAGE_KEY.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED,
    ),
  ).toBe(false);
  await userOption.set(
    STORAGE_KEY.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED,
    true,
  );
  expect(
    await userOption.get(
      STORAGE_KEY.LIGHTENS_ENTRY_WHOSE_COMMENTS_HAVE_BEEN_VISITED,
    ),
  ).toBe(true);
});
