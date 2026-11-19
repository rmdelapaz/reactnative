// Runs before every test file (package.json "jest" > "setupFilesAfterEnv"), as in Lessons 8.2 and 8.3
import { Dimensions } from 'react-native';

// 1. Requests go through Node's fetch (kept by jest.environment.js), where MSW can answer them.
// Loading the expo package installs Expo's fetch again (jest.mock() can load it a second time),
// so put Node's back now and once more before the file's tests start
function useNodeFetch() {
  const nodeFetch = (globalThis as { __nodeFetch?: typeof fetch }).__nodeFetch;
  Object.defineProperty(globalThis, 'fetch', { value: nodeFetch, writable: true, configurable: true });
}
useNodeFetch();
beforeAll(useNodeFetch);

// 2. The tests talk to the mock API through a server address, so the client's real fetch path is
// tested too (src/test/server.ts answers it). .env.local is Metro's: Jest never reads it
process.env.EXPO_PUBLIC_API_URL = 'http://localhost:4000';

// 3. Native modules without a phone under Jest: use the stand-ins their authors ship, or a jest.mock
// with a factory (Lesson 8.2). NetInfo ships one:
jest.mock('@react-native-community/netinfo', () =>
  jest.requireActual('@react-native-community/netinfo/jest/netinfo-mock'),
);

// 4. A phone-sized window at the normal text size, before every test. React Native's own Jest
// setup pretends a 750 x 1334 window with text at twice its size: a tablet with large text
const phone = { width: 390, height: 844, scale: 3, fontScale: 1 };
beforeEach(() => Dimensions.set({ window: phone, screen: phone }));
