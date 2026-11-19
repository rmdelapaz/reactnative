import { onlineManager } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';

import { readSession, setSession } from '@/api/client';
import { markSignInEnded } from '@/auth/ended';
import { useLogQueue } from '@/state/logQueue';
import { sendWaitingLogs } from '@/state/sendLogs';
import { saveSentLogs } from '@/storage/logbook';
import { makeEvent, makeLogToSend, volunteer } from '@/test/factories';
import { API_URL, recordRequests, server, startMockApi } from '@/test/server';

// The logbook is SQLite on the phone, and "your sign-in has ended" is a screen notice: Jest
// replaces both modules with empty functions that remember how they were called
jest.mock('@/storage/logbook');
jest.mock('@/auth/ended');

startMockApi();

beforeEach(() => {
  useLogQueue.setState(useLogQueue.getInitialState());
  setSession(volunteer);
  onlineManager.setOnline(true);
});

// One log waiting for Theo; the cleanup is e17 (today, where he has a spot) unless a test says
function queueLog(event = makeEvent()) {
  useLogQueue.getState().add(volunteer.user.id, makeLogToSend('log-0001', event), []);
}

it('sends a waiting log, saves it in the logbook, and takes it out of the queue', async () => {
  queueLog();
  await sendWaitingLogs(volunteer.user.id);

  expect(useLogQueue.getState().logs).toEqual([]);
  expect(saveSentLogs).toHaveBeenCalledWith([
    { log: expect.objectContaining({ clientId: 'log-0001', eventId: 'e17' }), event: makeEvent() },
  ]);
});

it('sends nothing while the phone is offline', async () => {
  queueLog();
  onlineManager.setOnline(false);
  const requests = recordRequests();

  await sendWaitingLogs(volunteer.user.id);

  expect(requests).toEqual([]);
  expect(useLogQueue.getState().logs).toHaveLength(1);
});

it("marks a log the server refuses, with the server's words", async () => {
  queueLog(makeEvent({ id: 'e08', title: 'Weekend Cove Cleanup' })); // in a few days
  await sendWaitingLogs(volunteer.user.id);

  expect(useLogQueue.getState().logs[0]).toMatchObject({
    status: 'refused',
    problem: 'This cleanup has not happened yet.',
  });
});

it('keeps the log and counts the try when the server does not answer', async () => {
  server.use(http.post(`${API_URL}/api/events/:id/logs`, () => HttpResponse.error()));
  queueLog();
  await sendWaitingLogs(volunteer.user.id);

  expect(useLogQueue.getState().logs[0]).toMatchObject({ status: 'waiting', attempts: 1 });
});

it('keeps the log for the next sign-in when the sign-in has ended', async () => {
  setSession({ ...volunteer, token: 'a-token-the-api-forgot' });
  queueLog();
  await sendWaitingLogs(volunteer.user.id);

  expect(markSignInEnded).toHaveBeenCalled();
  expect(readSession()).toBeNull();
  expect(useLogQueue.getState().logs[0]).toMatchObject({ status: 'waiting', attempts: 0 });
});
