import { PermissionStatus } from 'expo';
import * as Notifications from 'expo-notifications';

import { setSession } from '@/api/client';
import { queryClient } from '@/api/queries';
import { updateReminders } from '@/notifications/reminders';
import { changeSettings } from '@/state/settings';
import { volunteer } from '@/test/factories';
import { startMockApi } from '@/test/server';

// The phone's notifications, replaced by functions the tests control and read back. Only what
// reminders.ts uses: the real module needs a phone (its setNotificationHandler fails under Jest)
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  AndroidImportance: { DEFAULT: 3 },
  SchedulableTriggerInputTypes: { DATE: 'date' },
  getPermissionsAsync: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
}));
const notifications = jest.mocked(Notifications);

startMockApi();

// What the phone already has scheduled: only the ids matter here
function alreadyScheduled(...ids: string[]) {
  const requests = ids.map((identifier) => ({ identifier }) as Notifications.NotificationRequest);
  notifications.getAllScheduledNotificationsAsync.mockResolvedValue(requests);
}

function allowNotifications(granted: boolean) {
  notifications.getPermissionsAsync.mockResolvedValue({
    granted,
    status: granted ? PermissionStatus.GRANTED : PermissionStatus.DENIED,
    canAskAgain: true,
    expires: 'never',
  });
}

beforeEach(() => {
  setSession(volunteer);
  changeSettings({ remindersOn: true });
  allowNotifications(true);
  alreadyScheduled();
});

afterEach(() => {
  queryClient.clear(); // the sign-ups are cached between calls, as in the app
  jest.clearAllMocks(); // forget the calls each test made
});

// The ids of the reminders updateReminders scheduled, in order
function scheduledIds() {
  return notifications.scheduleNotificationAsync.mock.calls.map(([request]) => request.identifier);
}

it("schedules one reminder per confirmed cleanup that's still ahead, soonest first", async () => {
  await updateReminders();

  // Theo's sample sign-ups: e08, e10, e11 and e13 confirmed (e17 is today: too late to remind)
  expect(scheduledIds()).toEqual(['reminder-e08', 'reminder-e10', 'reminder-e11', 'reminder-e13']);
  const [first] = notifications.scheduleNotificationAsync.mock.calls[0];
  expect(first.content.title).toBe('Tomorrow: Weekend Cove Cleanup');
  expect(first.content.data).toEqual({ url: '/cleanups/e08' });
});

it("cancels the app's reminders nobody needs, and nothing else", async () => {
  alreadyScheduled('reminder-e08', 'reminder-e12', 'a-timer-from-another-part');
  await updateReminders();

  expect(notifications.cancelScheduledNotificationAsync.mock.calls).toEqual([['reminder-e12']]);
});

it('cancels every reminder once they are turned off', async () => {
  alreadyScheduled('reminder-e08', 'reminder-e10');
  changeSettings({ remindersOn: false });
  await updateReminders();

  expect(notifications.cancelScheduledNotificationAsync).toHaveBeenCalledTimes(2);
  expect(notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
});

it('schedules nothing when the phone does not allow notifications', async () => {
  allowNotifications(false);
  await updateReminders();

  expect(scheduledIds()).toEqual([]);
});
