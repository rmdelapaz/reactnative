// Reminders for a beach's next low tide (the lab's own module; the course app's is src/notifications/reminders.ts)
import * as Notifications from 'expo-notifications';

// Show a reminder even while the app is open. This line runs as soon as anything imports this file.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function remindMe(siteName: string): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: { title: 'Low tide soon', body: `${siteName}: the beach is at its widest in an hour.` },
    trigger: null,
  });
}
