// Tests (do not edit): npm test
import { redirectSystemPath } from './oldLinks';

const open = (path: string) => redirectSystemPath({ path, initial: true });

test("Task 1: last year's flyers open the cleanup", () => {
  expect(open('/event/e08')).toBe('/cleanups/e08');
  expect(open('event/e08')).toBe('/cleanups/e08');
});

test('Task 1: every other address passes through unchanged', () => {
  expect(open('/cleanups/e17')).toBe('/cleanups/e17');
  expect(open('/profile')).toBe('/profile');
});

test("Task 1: last spring's QR codes open the cleanup", () => {
  expect(open('/flyer?cleanup=e17')).toBe('/cleanups/e17');
});

test('Task 1: a strange link opens the first screen, and never crashes the app', () => {
  expect(open('/event/e08%2F..%2Fsign-in')).toBe('/');
  expect(open('/event/%E0%A4%A')).toBe('/');
});
