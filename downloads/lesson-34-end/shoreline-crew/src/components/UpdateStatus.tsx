import * as Updates from 'expo-updates';
import { useState } from 'react';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { canCheckForUpdates, currentRunningCode, runningCodeLine } from '@/utils/updateInfo';

// Which code this app runs, and (in preview and production builds) a way to fetch a new version
// now instead of at the next start (Lesson 9.3)
export function UpdateStatus() {
  const code = currentRunningCode();
  const { isChecking, isDownloading, isUpdatePending, lastCheckForUpdateTimeSinceRestart } =
    Updates.useUpdates();
  const [problem, setProblem] = useState<string | null>(null);

  async function checkNow() {
    setProblem(null);
    try {
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) await Updates.fetchUpdateAsync();
    } catch (error) {
      setProblem(error instanceof Error ? error.message : 'unknown error');
    }
  }

  const busy = isChecking || isDownloading;
  let state: string | null = null;
  if (isChecking) state = 'Checking for an update…';
  else if (isDownloading) state = 'Downloading the update…';
  else if (isUpdatePending) state = 'A new version is ready. It starts the next time the app opens.';
  else if (problem) state = `Could not check for an update: ${problem}`;
  else if (lastCheckForUpdateTimeSinceRestart) state = 'You have the newest version.';

  return (
    <>
      <AppText variant="muted">{runningCodeLine(code)}</AppText>
      {canCheckForUpdates(code) && (
        <>
          {state !== null && (
            <AppText variant={problem ? 'error' : 'body'} accessibilityLiveRegion="polite">
              {state}
            </AppText>
          )}
          {isUpdatePending ? (
            // Unsent debris logs are saved on the phone (Lesson 5.5): restarting loses nothing
            <Button label="Restart now" variant="primary" onPress={() => Updates.reloadAsync()} />
          ) : (
            <Button label="Check for an update" disabled={busy} onPress={checkNow} />
          )}
        </>
      )}
    </>
  );
}
