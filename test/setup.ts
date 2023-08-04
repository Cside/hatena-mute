import { fakeChrome } from './chrome/fakeChrome';

beforeAll(() => {
  vi.spyOn(console, 'info').mockImplementation(() => {});
});

Object.assign(global, { chrome: fakeChrome });
