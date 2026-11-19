// Tests (do not edit): npm test
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onlineManager } from '@tanstack/react-query';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { loadHazardQueue, QUEUE_KEY, useHazardQueue } from './hazardQueue';
import { NotSentList } from './NotSentList';
import { sendWaitingReports } from './sendReports';
import type { HazardReport } from './types';

// No phone under Jest: AsyncStorage's own stand-in keeps the saved values in memory
jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const API = 'http://api.test';
const report = (clientId: string, siteId = 'driftwood-cove'): HazardReport => ({
  clientId,
  siteId,
  kind: 'glass',
  note: 'Bottle glass by the north steps',
  seenAt: '2026-06-15T09:12:00.000Z',
});

// The practice server: the answer depends on the beach (one beach per kind of answer)
const posted: string[] = [];
const server = setupServer(
  http.post(`${API}/api/sites/:siteId/hazards`, async ({ params, request }) => {
    const body = (await request.json()) as HazardReport;
    posted.push(body.clientId);
    switch (params.siteId) {
      case 'driftwood-cove':
        return HttpResponse.json({ id: `hz-${body.clientId}` }, { status: 201 });
      case 'otter-creek': // an earlier try got through: the server already has this clientId
        return HttpResponse.json({ id: `hz-${body.clientId}` }, { status: 200 });
      case 'closed-beach':
        return HttpResponse.json(
          { error: 'forbidden', message: 'This beach is closed: report hazards to the park office.' },
          { status: 403 },
        );
      case 'signed-out':
        return HttpResponse.json({ error: 'unauthorized', message: 'Sign in first.' }, { status: 401 });
      case 'busy-server':
        return HttpResponse.json({ error: 'server_error', message: 'Try again later.' }, { status: 503 });
      default: // the connection dropped: no answer at all
        return HttpResponse.error();
    }
  }),
);
const unhandled: string[] = [];
beforeAll(() =>
  server.listen({
    onUnhandledFrame({ frame, defaults }) {
      const { data } = frame;
      const request =
        typeof data === 'object' && data !== null && 'request' in data && data.request instanceof Request
          ? data.request
          : undefined;
      unhandled.push(request ? `${request.method} ${request.url}` : frame.protocol);
      defaults.error();
    },
  }),
);
beforeEach(async () => {
  posted.length = 0;
  await AsyncStorage.clear();
  useHazardQueue.setState({ reports: [], sending: false });
});
afterEach(() => {
  const missed = unhandled.splice(0);
  if (missed.length) throw new Error(`No MSW handler for: ${missed.join(', ')}`);
  server.resetHandlers();
  onlineManager.setOnline(true);
});
afterAll(() => server.close());

const queued = () => useHazardQueue.getState().reports;
const send = (onSignInEnded = jest.fn()) =>
  sendWaitingReports({ api: API, volunteerId: 'v04', token: 'theo-token', onSignInEnded });

test('Task 1: an added report is saved in AsyncStorage, the reports only', async () => {
  useHazardQueue.getState().add('v04', report('h-0001'));
  const saved = JSON.parse((await AsyncStorage.getItem(QUEUE_KEY)) ?? 'null');
  expect(saved).toEqual({
    state: {
      reports: [{ report: report('h-0001'), volunteerId: 'v04', status: 'waiting', attempts: 0, problem: null }],
    },
    version: 0,
  });
});

test('Task 1: a saved queue is read back at startup, without anything in an old shape', async () => {
  const good = { report: report('h-0002'), volunteerId: 'v04', status: 'waiting', attempts: 1, problem: null };
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify({ state: { reports: [good, { note: 'old' }] }, version: 0 }));
  await loadHazardQueue();
  expect(queued()).toEqual([good]);
});

test('Task 2: 201 and 200 both mean done: the reports leave the queue', async () => {
  useHazardQueue.getState().add('v04', report('h-0003'));
  useHazardQueue.getState().add('v04', report('h-0004', 'otter-creek'));
  await send();
  expect(posted).toEqual(['h-0003', 'h-0004']);
  expect(queued()).toEqual([]);
});

test('Task 2: a 403 is refused with the server\'s words, and the next report still goes', async () => {
  useHazardQueue.getState().add('v04', report('h-0005', 'closed-beach'));
  useHazardQueue.getState().add('v04', report('h-0006'));
  await send();
  expect(queued()).toEqual([
    expect.objectContaining({
      status: 'refused',
      attempts: 0,
      problem: 'This beach is closed: report hazards to the park office.',
    }),
  ]);
  await send(); // a refused report is never sent again by itself
  expect(posted).toEqual(['h-0005', 'h-0006']);
});

test('Task 2: a 401 keeps everything, ends the sign-in and stops', async () => {
  useHazardQueue.getState().add('v04', report('h-0007', 'signed-out'));
  useHazardQueue.getState().add('v04', report('h-0008'));
  const onSignInEnded = jest.fn();
  await send(onSignInEnded);
  expect(onSignInEnded).toHaveBeenCalledTimes(1);
  expect(posted).toEqual(['h-0007']);
  expect(queued().map((item) => [item.status, item.attempts])).toEqual([
    ['waiting', 0],
    ['waiting', 0],
  ]);
});

test('Task 2: no answer, or a 503: the report waits, the try is counted, the run stops', async () => {
  useHazardQueue.getState().add('v04', report('h-0009', 'no-signal'));
  useHazardQueue.getState().add('v04', report('h-0010', 'busy-server'));
  await send();
  await send();
  expect(posted).toEqual(['h-0009', 'h-0009']);
  expect(queued().map((item) => [item.status, item.attempts])).toEqual([
    ['waiting', 2],
    ['waiting', 0],
  ]);
});

test('Task 2: offline, or another volunteer\'s report: nothing is sent', async () => {
  useHazardQueue.getState().add('v05', report('h-0011'));
  await send();
  useHazardQueue.getState().add('v04', report('h-0012'));
  onlineManager.setOnline(false);
  await send();
  expect(posted).toEqual([]);
  expect(queued()).toHaveLength(2);
});

test('Task 3: the Not sent yet list shows only the viewer\'s reports, and Remove works', async () => {
  useHazardQueue.getState().add('v04', report('h-0013'));
  useHazardQueue.getState().add('v05', report('h-0014', 'otter-creek'));
  useHazardQueue.getState().add('v04', report('h-0015', 'closed-beach'));
  useHazardQueue.getState().change('h-0015', { status: 'refused', problem: 'This beach is closed.' });
  await render(<NotSentList viewer="v04" />);
  expect(screen.getByRole('header', { name: 'Not sent yet' })).toBeOnTheScreen();
  expect(screen.getByText('Broken glass at driftwood-cove')).toBeOnTheScreen();
  expect(screen.queryByText('Broken glass at otter-creek')).toBeNull();
  await userEvent.setup().press(screen.getByRole('button', { name: 'Remove the report: Broken glass at closed-beach' }));
  expect(screen.queryByText('Not sent: This beach is closed.')).toBeNull();
  await act(() => useHazardQueue.getState().remove('h-0013'));
  expect(screen.getByText('Nothing waiting: every report is on the server.')).toBeOnTheScreen();
});
