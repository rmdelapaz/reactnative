// Runs before every test file (package.json "jest" > "setupFilesAfterEnv"), as in Lesson 8.2
import { Dimensions } from 'react-native';

// 1. Requests go through Node's fetch (kept by jest.environment.js), where MSW can answer them
function useNodeFetch() {
  const nodeFetch = (globalThis as { __nodeFetch?: typeof fetch }).__nodeFetch;
  Object.defineProperty(globalThis, 'fetch', { value: nodeFetch, writable: true, configurable: true });
}
useNodeFetch();
beforeAll(useNodeFetch);

// 2. A phone-sized window at the normal text size, before every test
const phone = { width: 390, height: 844, scale: 3, fontScale: 1 };
beforeEach(() => Dimensions.set({ window: phone, screen: phone }));
