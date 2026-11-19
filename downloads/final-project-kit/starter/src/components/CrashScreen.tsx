import type { ErrorBoundaryProps } from 'expo-router';
import { useEffect } from 'react';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { reportError } from '@/monitoring/reportError';
import { appVersionLine } from '@/utils/appInfo';

// What people see when a screen throws (Lesson 9.3), instead of the app closing: what happened in
// plain words, a way back, and the app's version for the bug report. Say what is safe in YOUR app.
export function CrashScreen({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    reportError(error, 'screen');
  }, [error]);

  return (
    <Screen>
      <AppText variant="heading" accessibilityRole="header">
        Something went wrong
      </AppText>
      <AppText>
        This screen stopped working. Try again, and if it happens again, tell us what you were doing.
      </AppText>
      <Button label="Try again" variant="primary" onPress={retry} />
      <AppText variant="muted">{appVersionLine()}</AppText>
    </Screen>
  );
}
