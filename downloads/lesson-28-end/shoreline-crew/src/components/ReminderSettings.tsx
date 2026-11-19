import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PermissionGate } from '@/components/PermissionGate';
import { SwitchRow } from '@/components/SwitchRow';
import { usePermission } from '@/hooks/usePermission';
import {
  remindersWork,
  sendTestReminder,
  updateReminders,
  useNotificationPermissions,
} from '@/notifications/reminders';
import { changeSettings, useSettings } from '@/state/settings';
import { spacing } from '@/theme/spacing';

// "Reminders" on the Profile tab. Nothing asks for notifications until the volunteer turns the
// switch on: that is the moment the question makes sense.
export function ReminderSettings() {
  const { remindersOn } = useSettings();
  return (
    <View style={styles.panel}>
      <AppText variant="heading" accessibilityRole="header">
        Reminders
      </AppText>
      <SwitchRow
        label="Remind me the evening before my cleanups"
        value={remindersOn}
        onValueChange={(on) => changeSettings({ remindersOn: on })}
      />
      {remindersOn && <RemindersAllowed onNotNow={() => changeSettings({ remindersOn: false })} />}
    </View>
  );
}

// Mounted once the switch is on: the permission Hook reads the answer here, and asks nobody
function RemindersAllowed({ onNotNow }: { onNotNow: () => void }) {
  const notifications = usePermission(useNotificationPermissions());

  // After the phone's question, set the reminders at once (whatever the answer, updateReminders
  // reads it again)
  async function ask() {
    const answer = await notifications.ask();
    void updateReminders();
    return answer;
  }

  return (
    <PermissionGate
      permission={{ ...notifications, ask }}
      what="notifications"
      why="At 6 pm the evening before each cleanup you have a spot at, Shoreline Crew reminds you when and where to meet. The reminders are set on this phone: no server sends them."
      onNotNow={onNotNow}
    >
      <RemindersOn />
    </PermissionGate>
  );
}

// Only rendered after a yes
function RemindersOn() {
  const [testNote, setTestNote] = useState<string | null>(null);

  if (!remindersWork) {
    return (
      <AppText variant="muted">
        The web preview cannot set reminders. They work in the app on your phone.
      </AppText>
    );
  }

  async function test() {
    const sent = await sendTestReminder();
    setTestNote(
      sent
        ? 'A test reminder arrives in 10 seconds. Lock your phone or go to the home screen to see it.'
        : 'Nothing to remind you about yet: sign up for a cleanup first.',
    );
  }

  return (
    <>
      <AppText variant="muted">
        Reminders are on for every cleanup you have a spot at. Tap one to open its cleanup.
      </AppText>
      {/* For trying it out: only in development, never in the app people install */}
      {__DEV__ && <Button label="Send a test reminder" onPress={test} />}
      {testNote !== null && <AppText accessibilityLiveRegion="polite">{testNote}</AppText>}
    </>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.sm,
  },
});
