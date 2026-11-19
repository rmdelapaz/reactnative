// Tests (do not edit): npm test. The user-event tests press, hold and type for real (a long press is 500 ms),
// so they get 20 seconds each instead of Jest's 5.
import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';

import upcoming from '../fixtures/upcoming.json';
import volunteers from '../fixtures/volunteers.json';
import { CheckInButton } from './CheckInButton';
import { CheckInDesk } from './CheckInDesk';
import { parseBags } from './parseBags';
import type { CleanupEvent, Volunteer } from './types';

// Every test may take up to 20 seconds: the first render compiles React Native, and a long press holds for real
jest.setTimeout(20000);

const crew = (volunteers as Volunteer[]).slice(0, 6);
const event: CleanupEvent = upcoming[0];

test('Task 1: a tap checks the volunteer in (a button with a name, for fingers and screen readers)', async () => {
  const user = userEvent.setup();
  const onCheckIn = jest.fn();
  await render(<CheckInButton name="Aisha Rahman" checkedIn={false} onCheckIn={onCheckIn} onUndo={() => {}} />);
  await user.press(screen.getByRole('button', { name: 'Check in Aisha Rahman' }));
  expect(onCheckIn).toHaveBeenCalledTimes(1);
}, 20000);

test('Task 1: the target is at least 48 high', async () => {
  await render(<CheckInButton name="Aisha Rahman" checkedIn={false} onCheckIn={() => {}} onUndo={() => {}} />);
  expect(screen.getByRole('button')).toHaveStyle({ minHeight: 48 });
});

test('Task 1: once checked in, a long press undoes it, and does not count as a tap', async () => {
  const user = userEvent.setup();
  await render(<CheckInDesk event={event} volunteers={crew} />);
  await user.press(screen.getByRole('button', { name: 'Check in Aisha Rahman' }));
  expect(screen.getByText('1 of 6 checked in')).toBeOnTheScreen();
  // hold for 800 ms: comfortably past the 500 ms a long press needs, even on a busy machine
  await user.longPress(screen.getByRole('button', { name: 'Aisha Rahman, checked in. Hold to undo' }), { duration: 800 });
  expect(screen.getByText('0 of 6 checked in')).toBeOnTheScreen();
}, 20000);

test('Task 2: parseBags turns the typed text into a count', () => {
  expect([parseBags(''), parseBags('12'), parseBags(' 7 '), parseBags('3a'), parseBags('-1')]).toEqual([0, 12, 7, null, null]);
});

test('Task 2: typing in the field updates the desk (and the phone shows the number keyboard)', async () => {
  const user = userEvent.setup();
  await render(<CheckInDesk event={event} volunteers={crew} />);
  const field = screen.getByLabelText('Bags collected');
  expect(field).toHaveProp('inputMode', 'numeric');
  await user.type(field, '12');
  expect(screen.getByText('12 bags collected')).toBeOnTheScreen();
}, 20000);

test('Task 3: the switch hides the volunteers who are already checked in', async () => {
  const user = userEvent.setup();
  await render(<CheckInDesk event={event} volunteers={crew} />);
  await user.press(screen.getByRole('button', { name: 'Check in Aisha Rahman' }));
  // a finger flipping the switch: the native switch reports a change event that carries the new value
  const onlyWaiting = () => screen.getByRole('switch', { name: 'Only volunteers not checked in yet' });
  await fireEvent(onlyWaiting(), 'change', { nativeEvent: { value: true } });
  expect(onlyWaiting()).toHaveProp('value', true);
  expect(screen.queryByText('Aisha Rahman: checked in')).not.toBeOnTheScreen();
  expect(screen.getAllByRole('button')).toHaveLength(5);
}, 20000);

test('Task 3: with the keyboard open, a tap on a button reaches the button', async () => {
  await render(<CheckInDesk event={event} volunteers={crew} />);
  expect(screen.getByTestId('desk')).toHaveProp('keyboardShouldPersistTaps', 'handled');
});
