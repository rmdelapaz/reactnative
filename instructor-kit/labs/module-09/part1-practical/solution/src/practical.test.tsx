// Tests (do not edit): npm test
import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';

import { shiftLabel } from './shifts';
import { SignUpList } from './SignUpList';

jest.setTimeout(30_000);

test('Task 1: a label for every shift', () => {
  expect(shiftLabel('setup')).toBe('Setup crew (9:00)');
  expect(shiftLabel('repair')).toBe('Repair tables (10:00 to 13:00)');
  expect(shiftLabel('cleanup')).toBe('Cleanup crew (13:00)');
});

test('Task 2: the volunteers, their shifts and the count', async () => {
  await render(<SignUpList />);
  expect(screen.getByText('4 volunteers')).toBeOnTheScreen();
  expect(screen.getByRole('header', { name: 'Noor' })).toBeOnTheScreen();
  expect(screen.getByText('Cleanup crew (13:00)')).toBeOnTheScreen();
});

test('Task 2: Only repair tables', async () => {
  await render(<SignUpList />);
  await fireEvent(screen.getByRole('switch', { name: 'Only repair tables' }), 'valueChange', true);
  expect(screen.getByText('2 of 4 volunteers')).toBeOnTheScreen();
  expect(screen.queryByRole('header', { name: 'Bea' })).not.toBeOnTheScreen();
});

test('Task 3: Add volunteer adds a repair-table volunteer and clears the field', async () => {
  const user = userEvent.setup();
  await render(<SignUpList />);
  await user.type(screen.getByLabelText('Volunteer name'), 'Ola');
  await user.press(screen.getByRole('button', { name: 'Add volunteer' }));
  expect(screen.getByRole('header', { name: 'Ola' })).toBeOnTheScreen();
  expect(screen.getByText('5 volunteers')).toBeOnTheScreen();
  expect(screen.getByLabelText('Volunteer name')).toHaveDisplayValue('');
});

test('Task 3: no name, no volunteer: a message instead', async () => {
  const user = userEvent.setup();
  await render(<SignUpList />);
  await user.press(screen.getByRole('button', { name: 'Add volunteer' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Type a name first.');
  expect(screen.getByText('4 volunteers')).toBeOnTheScreen();
});
