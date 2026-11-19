// Task 1 (reference): every test starts with an empty shed, so the order of the tests does not matter.
import { useGearShed } from './gearShed';

// The store lives in a module: put it back the way create() made it before every test
beforeEach(() => {
  useGearShed.setState(useGearShed.getInitialState());
});

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
