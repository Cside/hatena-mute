import { fakeStorage } from './fakeStorage';

afterEach(async () => {
  await fakeStorage.clear();
});

describe('get', () => {
  test('get empty value', async () => {
    expect(await fakeStorage.get('foo')).toEqual({});
  });

  test('get all', async () => {
    await fakeStorage.set({ foo: 1 });
    await fakeStorage.set({ bar: 2 });
    expect(await fakeStorage.get()).toEqual({ foo: 1, bar: 2 });
  });
});

test('remove', async () => {
  await fakeStorage.set({ foo: 1 });
  await fakeStorage.set({ bar: 2 });
  await fakeStorage.remove('foo');

  expect(await fakeStorage.get('foo')).toEqual({});
  expect(await fakeStorage.get('bar')).toEqual({ bar: 2 });
});

describe('set', () => {
  test('set multi', async () => {
    await fakeStorage.set({ foo: 1, bar: 2 });
    expect(await fakeStorage.get()).toEqual({ foo: 1, bar: 2 });
  });
});

test('clear', async () => {
  await fakeStorage.set({ foo: 1 });
  await fakeStorage.set({ bar: 2 });
  await fakeStorage.clear();

  expect(await fakeStorage.get('foo')).toEqual({});
  expect(await fakeStorage.get()).toEqual({});
});
