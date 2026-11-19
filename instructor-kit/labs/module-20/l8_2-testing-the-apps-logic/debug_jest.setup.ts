// Stretch handout: a copy of the finished app's jest.setup.ts with ONE line group missing.
// Copy it over shoreline-crew/jest.setup.ts in a COPY of lesson-29-end (never your own project), run the
// suite, and tell from the shape of the failure whether the app or the setup is broken.
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

