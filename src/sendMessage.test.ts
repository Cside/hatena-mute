import { TIMEOUT } from './sendMessage';

test.each([
  { input: 1, expected: 1_000 },
  { input: 2, expected: 3_000 },
  { input: 3, expected: 4_000 },
  { input: 4, expected: 5_000 },
])('$input -> $expected', ({ input, expected }) => {
  expect(TIMEOUT(input)).toBe(expected);
});
