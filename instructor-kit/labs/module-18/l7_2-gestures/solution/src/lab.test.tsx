// Tests (do not edit): npm test
// Jest has no UI thread and no finger. Reanimated's and Worklets' stand-ins run the worklets as plain functions,
// and Gesture Handler's test helper sends a pan's events (where the finger is, how fast) as if a finger moved.
import { render, screen, userEvent } from '@testing-library/react-native';
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/jest-utils';

import { type Loan, LoanList } from './LoanList';
import { shouldAsk } from './release';
import { WithGestures } from './testing';

jest.mock('react-native-reanimated', () => jest.requireActual('react-native-reanimated/mock'));
jest.mock('react-native-worklets', () => jest.requireActual('react-native-worklets/src/mock'));

const loans: Loan[] = [{ id: 'g1', item: 'litter grabber', borrower: 'Theo' }];

// A finger that moves left and lets go: `to` points from where it started, at `speed` points per second
function swipe(to: number, speed: number) {
  fireGestureHandler(getByGestureTestId('swipe-to-return'), [
    { translationX: 0 },
    { translationX: to / 2 },
    { translationX: to, velocityX: speed },
  ]);
}

test('Task 1: far enough asks, even slowly', () => {
  expect(shouldAsk(-150, -100)).toBe(true);
});

test('Task 1: a short quick flick asks', () => {
  expect(shouldAsk(-70, -1200)).toBe(true);
});

test('Task 1: short and slow springs back without asking', () => {
  expect(shouldAsk(-60, -100)).toBe(false);
});

test('Task 2: a far swipe asks before anything is marked returned', async () => {
  const onReturned = jest.fn();
  await render(<WithGestures><LoanList loans={loans} onReturned={onReturned} /></WithGestures>);
  swipe(-150, -100);
  expect(await screen.findByText('Has Theo brought it back?')).toBeOnTheScreen();
  expect(onReturned).not.toHaveBeenCalled();
});

test('Task 2: a short slow swipe does nothing', async () => {
  await render(<WithGestures><LoanList loans={loans} onReturned={jest.fn()} /></WithGestures>);
  swipe(-60, -100);
  await new Promise((done) => setTimeout(done, 50));
  expect(screen.queryByText('Has Theo brought it back?')).toBeNull();
});

test('Task 3: no swipe needed: the Return button asks the same question', async () => {
  const onReturned = jest.fn();
  const user = userEvent.setup();
  await render(<WithGestures><LoanList loans={loans} onReturned={onReturned} /></WithGestures>);
  await user.press(screen.getByRole('button', { name: 'Return the litter grabber lent to Theo' }));
  await user.press(screen.getByRole('button', { name: 'Yes, returned' }));
  expect(onReturned).toHaveBeenCalledWith('g1');
});
