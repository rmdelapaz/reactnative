// Task 1 (edit THIS file, not gearShed.ts): each test passes when it runs alone and fails in the full run.
import { useGearShed } from './gearShed';

// TODO 1: the store lives in a module. Give every test an empty shed before it starts (Lesson 8.2,
// "State lives in modules"), here, above the tests.

it('lends a grabber to the first volunteer who asks', () => {
  expect(useGearShed.getState().borrow('grabber-1', 'v04')).toBe(true);
  expect(useGearShed.getState().loans).toEqual([{ itemId: 'grabber-1', volunteerId: 'v04' }]);
});

it('refuses an item that is already out', () => {
  const { borrow } = useGearShed.getState();
  expect(borrow('grabber-1', 'v04')).toBe(true);
  expect(borrow('grabber-1', 'v07')).toBe(false);
});

it('starts the day with everything on the shelf', () => {
  expect(useGearShed.getState().loans).toEqual([]);
});
