// Tests (do not edit): npm test. renderRouter (expo-router/testing-library) builds a real Expo Router app
// from the screens below, opened at initialUrl: the same as typing that address, or following a link.
import { act, screen } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { Text } from 'react-native';

import organizer from '../fixtures/me-organizer.json';
import saved from '../fixtures/sign-in-theo.json';
import { CrewStack } from './CrewStack';
import { setSession } from './session';
import type { Session } from './types';

const theo = saved as Session; // a volunteer
const maya: Session = { token: 'dev-organizer', user: organizer as Session['user'] }; // an organizer

const routes = {
  _layout: CrewStack,
  index: () => <Text>Upcoming cleanups</Text>,
  'kit-room': () => <Text>Gloves, bags and grabbers</Text>,
  'sign-in': () => <Text>Sign in with your crew account</Text>,
};

beforeEach(() => setSession(null));

test('Task 3: a guest who opens /sign-in sees the form', async () => {
  await renderRouter(routes, { initialUrl: '/sign-in' });
  expect(screen.getByText('Sign in with your crew account')).toBeOnTheScreen();
  expect(screen).toHavePathname('/sign-in');
});

test('Task 3: a volunteer who opens /sign-in lands on the first screen', async () => {
  setSession(theo);
  await renderRouter(routes, { initialUrl: '/sign-in' });
  expect(screen.getByText('Upcoming cleanups')).toBeOnTheScreen();
  expect(screen).toHavePathname('/');
});

test('Task 3: a volunteer who opens /kit-room lands on the first screen', async () => {
  setSession(theo);
  await renderRouter(routes, { initialUrl: '/kit-room' });
  expect(screen.queryByText('Gloves, bags and grabbers')).toBeNull();
  expect(screen).toHavePathname('/');
});

test('Task 3: an organizer who opens /kit-room sees it', async () => {
  setSession(maya);
  await renderRouter(routes, { initialUrl: '/kit-room' });
  expect(screen.getByText('Gloves, bags and grabbers')).toBeOnTheScreen();
  expect(screen).toHavePathname('/kit-room');
});

test('Task 3 (needs Task 1): signing in while /sign-in is open takes the screen away', async () => {
  await renderRouter(routes, { initialUrl: '/sign-in' });
  await act(() => setSession(theo));
  expect(screen.queryByText('Sign in with your crew account')).toBeNull();
  expect(screen).toHavePathname('/');
});
