// Tests: npm test -- src/SiteSearch.test.tsx (Tasks 1 and 2)
import { render, screen, userEvent } from '@testing-library/react-native';

import { SiteSearch } from './SiteSearch';

// SiteSearch imports ./reminders, which imports expo-notifications: it cannot load in Jest (Lesson 8.4)
jest.mock('./reminders', () => ({ remindMe: jest.fn(async () => 'reminder-1') }));

test('Task 1: lists all six beaches before anything is typed', async () => {
  await render(<SiteSearch />);
  expect(screen.getByText('6 beaches')).toBeOnTheScreen();
});

test('Task 1: finds a beach by its name, typed as it is written', async () => {
  const user = userEvent.setup();
  await render(<SiteSearch />);
  await user.type(screen.getByLabelText('Search beaches'), 'Cove');
  expect(screen.getByText('Driftwood Cove')).toBeOnTheScreen();
  expect(screen.getByText('1 beach')).toBeOnTheScreen();
});

test('Task 1: Remind me sets a reminder for that beach', async () => {
  const user = userEvent.setup();
  await render(<SiteSearch />);
  await user.press(screen.getByRole('button', { name: 'Remind me about low tide at North Jetty' }));
  expect(await screen.findByText('Reminder set for North Jetty')).toBeOnTheScreen();
});

// The report: "I typed cove and nothing came up, but the beach is called Driftwood Cove!"
test('Task 2: finds a beach whatever the case of the letters typed', async () => {
  const user = userEvent.setup();
  await render(<SiteSearch />);
  await user.type(screen.getByLabelText('Search beaches'), 'cove');
  expect(screen.getByText('Driftwood Cove')).toBeOnTheScreen();
  expect(screen.getByText('1 beach')).toBeOnTheScreen();
});
