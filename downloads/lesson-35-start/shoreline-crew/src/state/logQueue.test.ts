import AsyncStorage from '@react-native-async-storage/async-storage';

import { loadLogQueue, useLogQueue } from '@/state/logQueue';
import { makeLogToSend, volunteer } from '@/test/factories';

const savedKey = 'shoreline-crew-log-queue';

// The store lives in a module: every test starts with an empty queue and empty storage
beforeEach(async () => {
  useLogQueue.setState(useLogQueue.getInitialState());
  await AsyncStorage.clear();
});

it('keeps one log per clientId', () => {
  const { add } = useLogQueue.getState();
  add(volunteer.user.id, makeLogToSend('log-0001'), []);
  add(volunteer.user.id, makeLogToSend('log-0001'), []); // the same log again: a double tap
  expect(useLogQueue.getState().logs).toHaveLength(1);
  expect(useLogQueue.getState().logs[0]).toMatchObject({ status: 'waiting', attempts: 0 });
});

it('saves the logs on the phone, but not "sending right now"', async () => {
  useLogQueue.getState().add(volunteer.user.id, makeLogToSend('log-0001'), []);
  useLogQueue.getState().setSending(true);

  const saved = JSON.parse((await AsyncStorage.getItem(savedKey)) ?? 'null');
  expect(saved.version).toBe(1);
  expect(saved.state.logs).toHaveLength(1);
  expect(saved.state).not.toHaveProperty('sending');
});

it('loads a saved queue, keeps what passes the check, and upgrades version 0', async () => {
  const fromVersion0 = { ...makeLogToSend('log-0001'), volunteerId: 'v04', status: 'waiting', attempts: 0 };
  const broken = { volunteerId: 'v04', status: 'lost' };
  await AsyncStorage.setItem(
    savedKey,
    JSON.stringify({ version: 0, state: { logs: [fromVersion0, broken] } }),
  );

  await loadLogQueue();

  const { logs } = useLogQueue.getState();
  expect(logs).toHaveLength(1);
  expect(logs[0].log.clientId).toBe('log-0001');
  expect(logs[0].photos).toEqual([]); // version 1 added photos
});
