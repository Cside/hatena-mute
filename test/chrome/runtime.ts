import { chrome } from 'jest-chrome';
import manifest from '../../manifest.json';
import { version } from '../../package.json';

manifest.version = version;

beforeAll(() => {
  chrome.runtime.getManifest.mockReturnValue(
    manifest as chrome.runtime.Manifest,
  );
  chrome.runtime.getURL.mockImplementation(
    (str: string) => `chrome://<extension-id>/${str}`,
  );
});

afterAll(() => {
  jest.resetAllMocks();
});
