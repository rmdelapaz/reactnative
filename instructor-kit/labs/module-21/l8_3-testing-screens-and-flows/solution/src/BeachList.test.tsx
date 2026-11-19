// Task 2 (reference): BeachList's three faces, with the mock API in src/test/server.ts
import { render, screen, userEvent } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';

import { BeachList } from './BeachList';
import { API_URL, server, startMockApi } from './test/server';

startMockApi();

it('says it is loading, then lists every beach', async () => {
  await render(<BeachList apiUrl={API_URL} />);
  expect(screen.getByText('Loading beaches…')).toBeOnTheScreen();
  expect(await screen.findByRole('header', { name: '6 beaches' })).toBeOnTheScreen();
  expect(screen.getByText('Pelican Point Beach, Port Marisol')).toBeOnTheScreen();
});

it('says what went wrong as an alert, and tries again', async () => {
  server.use(http.get(`${API_URL}/api/sites`, () => new HttpResponse(null, { status: 503 }), { once: true }));
  const user = userEvent.setup();
  await render(<BeachList apiUrl={API_URL} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Could not load the beaches (503).');
  await user.press(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByRole('header', { name: '6 beaches' })).toBeOnTheScreen();
});
