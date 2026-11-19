// Runs before every test file (package.json "jest" > "setupFilesAfterEnv"), as in Lesson 8.2's setup
import { Dimensions } from 'react-native';

// 1. Requests go through Node's fetch (kept by jest.environment.js), where MSW can answer them
function useNodeFetch() {
  const nodeFetch = (globalThis as { __nodeFetch?: typeof fetch }).__nodeFetch;
  Object.defineProperty(globalThis, 'fetch', { value: nodeFetch, writable: true, configurable: true });
}
useNodeFetch();
beforeAll(useNodeFetch);

// 2. The API address the tests use. .env.local is Metro's: Jest never reads it
process.env.EXPO_PUBLIC_API_URL = 'http://localhost:4100';

// 3. AsyncStorage has no phone under Jest: use the stand-in its authors ship
jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// 4. A phone-sized window at the normal text size, before every test
const phone = { width: 390, height: 844, scale: 3, fontScale: 1 };
beforeEach(() => Dimensions.set({ window: phone, screen: phone }));
