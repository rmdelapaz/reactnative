// Tests (do not edit): npm test
import { render, screen, userEvent } from '@testing-library/react-native';

import { SignUpDesk } from './SignUpDesk';
import { WelcomeBanner } from './WelcomeBanner';

test('Task 1: the banner shows the crew and its tagline', async () => {
  await render(<WelcomeBanner crewName="Shoreline Crew" />);
  expect(screen.getByRole('header', { name: 'Shoreline Crew' })).toBeOnTheScreen();
  expect(screen.getByText('Many hands, cleaner sands.')).toBeOnTheScreen();
});

test('Task 1: the tagline keeps its look', async () => {
  await render(<WelcomeBanner crewName="Shoreline Crew" />);
  expect(screen.getByText('Many hands, cleaner sands.')).toHaveStyle({ fontSize: 18, color: '#1f6f8b' });
});

test('Task 2: an open desk counts volunteers', async () => {
  const user = userEvent.setup();
  await render(<SignUpDesk open />);
  await user.press(screen.getByRole('button', { name: 'Add a volunteer' }));
  expect(screen.getByText('1 signed up at the desk')).toBeOnTheScreen();
});

test('Task 2: a closed desk says so', async () => {
  await render(<SignUpDesk open={false} />);
  expect(screen.getByText('Sign-ups are closed')).toBeOnTheScreen();
});
