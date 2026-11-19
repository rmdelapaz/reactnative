// Runs before every test file (package.json "jest" > "setupFilesAfterEnv")

// 1. Requests go through Node's fetch (kept by jest.environment.js), where MSW can answer them.
// Loading the expo package installs Expo's fetch again (jest.mock() can load it a second time),
// so put Node's back now and once more before the file's tests start
function useNodeFetch() {
  const nodeFetch = (globalThis as { __nodeFetch?: typeof fetch }).__nodeFetch;
  Object.defineProperty(globalThis, 'fetch', { value: nodeFetch, writable: true, configurable: true });
}
useNodeFetch();
beforeAll(useNodeFetch);

// 2. The API address the tests use. .env.local is Metro's: Jest never reads it
process.env.EXPO_PUBLIC_API_URL = 'http://localhost:4000';

// 3. Native modules that have no phone under Jest: use the stand-ins their authors ship
jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
