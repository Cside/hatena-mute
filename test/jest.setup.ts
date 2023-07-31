import '@testing-library/jest-dom';
import './chrome';

beforeAll(() => {
  jest.spyOn(console, 'info').mockImplementation(() => {});
});

afterAll(() => {
  jest.resetAllMocks();
});
