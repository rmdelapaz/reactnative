// Tests (do not edit): npm test
import type { NotificationRequestInput } from 'expo-notifications';

import { loansToRemind, reminderTime, syncGearReminders, type ReminderPhone } from './gearReminders';
import { pathFromTap } from './taps';
import type { GearLoan } from './types';

// The tests stand in for expo-notifications: only the trigger types are needed here, and the phone's
// scheduler is the fake below (the web preview has none, and Jest has no phone)
jest.mock('expo-notifications', () => ({ SchedulableTriggerInputTypes: { DATE: 'date' } }));

// A stand-in for the phone's scheduler: it keeps every request in memory, by identifier
function fakePhone(alreadyThere: string[] = []) {
  const held = new Map<string, NotificationRequestInput>();
  for (const id of alreadyThere) {
    held.set(id, { identifier: id, content: { title: id }, trigger: null });
  }
  const phone: ReminderPhone = {
    getAllScheduledNotificationsAsync: async () => [...held.keys()].map((identifier) => ({ identifier })),
    cancelScheduledNotificationAsync: async (identifier) => {
      held.delete(identifier);
    },
    scheduleNotificationAsync: async (request) => {
      const id = request.identifier ?? `auto-${held.size}`;
      held.set(id, request); // the same id again replaces it, as on a phone
      return id;
    },
  };
  return { phone, held, ids: () => [...held.keys()].sort() };
}

const now = new Date('2026-11-20T09:00');
const loans: GearLoan[] = [
  { id: 'l-201', item: 'Litter grabber', dueDate: '2026-11-25', status: 'out' },
  { id: 'l-202', item: 'Sand sieve', dueDate: '2026-12-01', status: 'out' }, // due on the 1st
  { id: 'l-203', item: 'Work gloves', dueDate: '2026-11-22', status: 'returned' },
  { id: 'l-204', item: 'Bucket', dueDate: '2026-11-20', status: 'out' }, // due today: 5 pm yesterday has passed
];

test('Task 1: 5 pm the day before, month and year ends included', () => {
  expect(reminderTime(loans[0])).toEqual(new Date('2026-11-24T17:00'));
  expect(reminderTime(loans[1])).toEqual(new Date('2026-11-30T17:00'));
  expect(reminderTime({ ...loans[0], dueDate: '2027-01-01' })).toEqual(new Date('2026-12-31T17:00'));
});

test('Task 1: only loans still out, with the reminder still ahead, soonest first', () => {
  const later = { ...loans[0], id: 'l-205', dueDate: '2026-11-23' };
  expect(loansToRemind([...loans, later], now).map((loan) => loan.id)).toEqual(['l-205', 'l-201', 'l-202']);
});

test('Task 2: one reminder per loan, a DATE trigger, and the loan to open', async () => {
  const { phone, held, ids } = fakePhone();
  await syncGearReminders(phone, loans, now);
  expect(ids()).toEqual(['gear-l-201', 'gear-l-202']);
  expect(held.get('gear-l-202')?.trigger).toEqual({ type: 'date', date: new Date('2026-11-30T17:00') });
  expect(held.get('gear-l-202')?.content.data).toEqual({ url: '/loans/l-202' });
});

test("Task 2: the phone's other reminders are never touched", async () => {
  const { phone, ids } = fakePhone(['test-reminder', 'tide-weekly']);
  await syncGearReminders(phone, loans, now);
  expect(ids()).toEqual(['gear-l-201', 'gear-l-202', 'test-reminder', 'tide-weekly']);
});

test('Task 2: a returned loan loses its reminder, and running again changes nothing', async () => {
  const { phone, ids } = fakePhone(['tide-weekly']);
  await syncGearReminders(phone, loans, now);
  const returned = loans.map((loan) => (loan.id === 'l-201' ? { ...loan, status: 'returned' as const } : loan));
  await syncGearReminders(phone, returned, now);
  expect(ids()).toEqual(['gear-l-202', 'tide-weekly']);
  await syncGearReminders(phone, returned, now);
  expect(ids()).toEqual(['gear-l-202', 'tide-weekly']);
});

test('Task 3: a tap on a gear reminder opens its loan', () => {
  expect(pathFromTap({ url: '/loans/l-204' })).toBe('/loans/l-204');
});

test.each([
  ['a web address', { url: 'https://example.com/loans/l-204' }],
  ['a way out of /loans/', { url: '/loans/../sign-in' }],
  ['a deeper path', { url: '/loans/l-204/return' }],
  ['another screen', { url: '/sign-in' }],
  ['a number', { url: 42 }],
  ['no data at all', undefined],
])('Task 3: %s opens nothing', (_name, data) => {
  expect(pathFromTap(data)).toBeNull();
});
