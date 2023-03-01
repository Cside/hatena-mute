import { matchesLoosely } from './utils';

describe('matchesLoosely', () => {
  for (const [name, tests] of Object.entries({
    'Hankaku characters': [
      {
        input: ['foobarbaz', 'bar'],
        expected: true,
      },
      {
        input: ['foobarbaz', 'ba_r'],
        expected: false,
      },
      {
        input: ['foobarbaz', 'BAR'],
        expected: true,
      },
      {
        input: ['FOOBARBAZ', 'bar'],
        expected: true,
      },
      {
        input: ['0123', '12'],
        expected: true,
      },
      {
        input: ['0123', '34'],
        expected: false,
      },
    ],
    Kanji: [
      {
        input: ['朝鮮民主主義人民共和国', '民主主義'],
        expected: true,
      },
      {
        input: ['朝鮮民主主義人民共和国', '日本'],
        expected: false,
      },
    ],
    'Zenkaku numbers': [
      {
        input: ['０１２３', '12'],
        expected: true,
      },
      {
        input: ['０１２３', '34'],
        expected: false,
      },
      {
        input: ['0123', '１２'],
        expected: true,
      },
      {
        input: ['０１２３', '１２'],
        expected: true,
      },
    ],
    'Zenkaku characters': [
      {
        input: ['Ｃｏｌａｂｏ問題', 'Colabo'],
        expected: true,
      },
      {
        input: ['Ｃｏｌａｂｏ問題', 'foo'],
        expected: false,
      },
      {
        input: ['Colabo問題', 'Ｃｏｌａｂｏ'],
        expected: true,
      },
      {
        input: ['Ｃｏｌａｂｏ問題', 'Ｃｏｌａｂｏ'],
        expected: true,
      },
    ],
  })) {
    describe(name, () => {
      test.each(tests)('$input -> $expected', ({ input, expected }) => {
        expect(matchesLoosely(...(input as [string, string]))).toBe(expected);
      });
    });
  }
});
