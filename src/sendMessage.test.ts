import { TIMEOUT } from './sendMessage';

test.each([
  { input: 1, expected: 500 },
  { input: 2, expected: 700 },
  { input: 3, expected: 900 },
  { input: 4, expected: 1_100 },
])('$input -> $expected', ({ input, expected }) => {
  expect(TIMEOUT(input)).toBe(expected);
});
