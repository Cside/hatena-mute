    {
      input: `foo\n\nbar`,
      expected: `foo\nbar`,
    },
    {
      input: `foo\n`,
      expected: `foo`,
    },
    {
      input: `\n\n`,
      expected: undefined,