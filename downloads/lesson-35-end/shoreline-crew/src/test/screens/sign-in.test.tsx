import { screen, userEvent } from '@testing-library/react-native';
import { Stack } from 'expo-router';
import { testRouter } from 'expo-router/testing-library';

import { readSession, setSession } from '@/api/client';
import SignInScreen from '@/app/sign-in';
import { AppText } from '@/components/AppText';
import { renderScreens } from '@/test/render';
import { startMockApi } from '@/test/server';

startMockApi();
beforeEach(() => setSession(null));

// The sign-in modal, opened from a screen underneath it (the Profile tab, in the app)
async function openSignIn() {
  await renderScreens({
    _layout: () => <Stack />,
    index: () => <AppText>Profile</AppText>,
    'sign-in': SignInScreen,
  });
  await testRouter.push('/sign-in');
  return userEvent.setup();
}

it('says what to fix when Sign in is pressed with nothing typed', async () => {
  const user = await openSignIn();
  await user.press(screen.getByRole('button', { name: 'Sign in' }));
  expect(await screen.findByText('Enter an email address.')).toBeOnTheScreen();
  expect(screen.getByText('Enter your password.')).toBeOnTheScreen();
  expect(readSession()).toBeNull();
});

it("shows the API's answer to a wrong password, and empties the password", async () => {
  const user = await openSignIn();
  await user.type(screen.getByLabelText('Email'), 'theo.nakamura@example.com');
  await user.type(screen.getByLabelText('Password'), 'low-tide');
  await user.press(screen.getByRole('button', { name: 'Sign in' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Email or password is incorrect.');
  expect(screen.getByLabelText('Password')).toHaveDisplayValue('');
});

it('signs in, then closes, back on the screen that opened it', async () => {
  const user = await openSignIn();
  await user.type(screen.getByLabelText('Email'), 'theo.nakamura@example.com');
  await user.type(screen.getByLabelText('Password'), 'shoreline-demo');
  await user.press(screen.getByRole('button', { name: 'Sign in' }));
  expect(await screen.findByText('Profile')).toBeOnTheScreen();
  expect(screen).toHavePathname('/');
  expect(readSession()?.user.name).toBe('Theo Nakamura');
});
