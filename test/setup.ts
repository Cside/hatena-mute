import { fakeChrome } from './chrome/fakeChrome';

Object.assign(global, { chrome: fakeChrome });
