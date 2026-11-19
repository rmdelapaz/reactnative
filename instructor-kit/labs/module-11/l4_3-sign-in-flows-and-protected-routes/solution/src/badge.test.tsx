// Tests (do not edit): npm test
import { act, render, screen, userEvent } from '@testing-library/react-native';

import saved from '../fixtures/sign-in-theo.json';
import { CrewBadge } from './CrewBadge';
import { readSession, setSession } from './session';
import type { Session } from './types';

const theo = saved as Session; // a real answer of POST /api/auth/sign-in

beforeEach(() => setSession(null));

test('Task 1: the badge draws again when someone signs in', async () => {
  await render(<CrewBadge />);
  expect(screen.getByRole('header', { name: 'Not signed in' })).toBeOnTheScreen();
  await act(() => setSession(theo));
  expect(screen.getByRole('header', { name: 'Theo Nakamura' })).toBeOnTheScreen();
  expect(screen.getByText('Volunteer')).toBeOnTheScreen();
});

test('Task 1: Sign out forgets the session, and the badge says so', async () => {
  const user = userEvent.setup();
  setSession(theo);
  await render(<CrewBadge />);
  await user.press(screen.getByRole('button', { name: 'Sign out' }));
  expect(readSession()).toBeNull();
  expect(screen.getByRole('header', { name: 'Not signed in' })).toBeOnTheScreen();
});
