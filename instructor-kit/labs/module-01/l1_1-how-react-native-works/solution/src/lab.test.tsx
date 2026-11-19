// Tests (do not edit): npm test
import { render, screen, userEvent } from '@testing-library/react-native';

import sites from '../fixtures/sites.json';
import upcoming from '../fixtures/upcoming.json';
import { SignUpButton } from './SignUpButton';
import { SiteCard } from './SiteCard';
import { spotsLabel } from './spots';
import type { CleanupEvent, Site } from './types';

const site = (id: string): Site => sites.find((s) => s.id === id)!;
const event = (id: string): CleanupEvent => upcoming.find((e) => e.id === id)!;

test('Task 1: the site card shows the name as a heading', async () => {
  await render(<SiteCard site={site('pelican-point')} />);
  expect(screen.getByRole('header', { name: 'Pelican Point Beach' })).toBeOnTheScreen();
  expect(screen.getByText('Port Marisol')).toBeOnTheScreen();
  expect(screen.getByText('Step-free access')).toBeOnTheScreen();
});

test('Task 1: a beach without step-free access says so', async () => {
  await render(<SiteCard site={site('driftwood-cove')} />);
  expect(screen.getByText('Stairs or rough ground')).toBeOnTheScreen();
});

test('Task 2: a press signs you up, a second press undoes it', async () => {
  const user = userEvent.setup();
  await render(<SignUpButton />);
  await user.press(screen.getByRole('button', { name: 'Sign up' }));
  expect(screen.getByRole('button', { name: "You're in!" })).toBeOnTheScreen();
  await user.press(screen.getByRole('button', { name: "You're in!" }));
  expect(screen.getByRole('button', { name: 'Sign up' })).toBeOnTheScreen();
});

test('Task 3: the label for the spots left, from the real upcoming cleanups', () => {
  expect(spotsLabel(event('e17'))).toBe('5 spots left');
  expect(spotsLabel(event('e11'))).toBe('1 spot left');
  expect(spotsLabel(event('e08'))).toBe('Full: join the waiting list');
});
