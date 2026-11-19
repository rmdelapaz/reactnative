// Tests (do not edit): npm test
import { fireEvent, render, screen, userEvent, waitFor } from '@testing-library/react-native';
import { TextInput } from 'react-native';

import { shiftReportSchema } from './schema';
import { ShiftReportForm } from './ShiftReportForm';

// A test has no keyboard. React Native's test version of TextInput records every focus() call; this reads which
// field it was called on last (by its label)
const focus = (TextInput as unknown as { prototype: { focus: jest.Mock } }).prototype.focus;
function lastFocused() {
  const field = focus.mock.contexts.at(-1) as { props?: { accessibilityLabel?: string } } | undefined;
  return field?.props?.accessibilityLabel;
}
beforeEach(() => focus.mockClear());

async function fillIn(leader: string, volunteers: string, hours: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Crew leader'), leader);
  await user.type(screen.getByLabelText('Volunteers'), volunteers);
  await user.type(screen.getByLabelText('Hours'), hours);
  return user;
}

test('Task 1: what you type is what the form sends', async () => {
  const onSend = jest.fn();
  await render(<ShiftReportForm onSend={onSend} />);
  const user = await fillIn('Maya Okafor', '12', '2.5');
  await user.press(screen.getByRole('button', { name: 'Send report' }));
  await waitFor(() => expect(onSend).toHaveBeenCalledTimes(1));
  expect(onSend.mock.calls[0][0]).toEqual({ leader: 'Maya Okafor', volunteers: 12, hours: 2.5 });
});

test("Task 1: an empty report shows each field's message and focuses the first", async () => {
  const onSend = jest.fn();
  await render(<ShiftReportForm onSend={onSend} />);
  await userEvent.setup().press(screen.getByRole('button', { name: 'Send report' }));
  expect(await screen.findByText("Enter the crew leader's name.")).toBeOnTheScreen();
  expect(screen.getByText('Volunteers must be a whole number from 1 to 200.')).toBeOnTheScreen();
  expect(screen.getByText('Hours must be a number from 0 to 12.')).toBeOnTheScreen();
  expect(lastFocused()).toBe('Crew leader');
  expect(onSend).not.toHaveBeenCalled();
});

test('Task 2: a comma works as the decimal point', () => {
  const result = shiftReportSchema.safeParse({ leader: 'Maya Okafor', volunteers: '12', hours: '2,5' });
  expect(result.success && result.data.hours).toBe(2.5);
});

test('Task 2: an empty count is a message, not a silent 0', () => {
  const result = shiftReportSchema.safeParse({ leader: 'Maya Okafor', volunteers: ' ', hours: '3' });
  expect(result.error?.issues.map((issue) => issue.message)).toEqual([
    'Volunteers must be a whole number from 1 to 200.',
  ]);
});

test('Task 3: the return key says Next, Next, Go', async () => {
  await render(<ShiftReportForm onSend={jest.fn()} />);
  expect(screen.getByLabelText('Crew leader')).toHaveProp('enterKeyHint', 'next');
  expect(screen.getByLabelText('Volunteers')).toHaveProp('enterKeyHint', 'next');
  expect(screen.getByLabelText('Hours')).toHaveProp('enterKeyHint', 'go');
});

test('Task 3: Next moves the focus to the next field', async () => {
  await render(<ShiftReportForm onSend={jest.fn()} />);
  // setFocus moves the focus a moment later (React Hook Form waits for the current event to end)
  fireEvent(screen.getByLabelText('Crew leader'), 'submitEditing');
  await waitFor(() => expect(lastFocused()).toBe('Volunteers'));
  fireEvent(screen.getByLabelText('Volunteers'), 'submitEditing');
  await waitFor(() => expect(lastFocused()).toBe('Hours'));
});

test('Task 3: Go on the last field sends the report', async () => {
  const onSend = jest.fn();
  await render(<ShiftReportForm onSend={onSend} />);
  await fillIn('Maya Okafor', '9', '3,5');
  fireEvent(screen.getByLabelText('Hours'), 'submitEditing');
  await waitFor(() => expect(onSend).toHaveBeenCalledTimes(1));
  expect(onSend.mock.calls[0][0]).toEqual({ leader: 'Maya Okafor', volunteers: 9, hours: 3.5 });
});
