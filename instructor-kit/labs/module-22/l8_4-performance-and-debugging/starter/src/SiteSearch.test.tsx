// Tests: npm test -- src/SiteSearch.test.tsx (Tasks 1 and 2)
import { render, screen, userEvent } from '@testing-library/react-native';

import { SiteSearch } from './SiteSearch';

// TODO 1: this file fails before any test runs. Read the stack from the bottom up, then put a stand-in for
// ./reminders here: jest.mock with a factory, as Lesson 8.4 did for the course app's reminders.

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
  throw new Error(
    'TODO 2: reproduce the report first (type cove, expect Driftwood Cove and 1 beach), watch it fail, then fix one thing',
  );
});
