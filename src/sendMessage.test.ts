import { TIMEOUT } from './sendMessage';

test.each([
  { input: 1, expected: 500 },
  { input: 2, expected: 1_500 },
  { input: 3, expected: 2_500 },
  { input: 4, expected: 3_500 },
])('$input -> $expected', ({ input, expected }) => {
  expect(TIMEOUT(input)).toBe(expected);
});
