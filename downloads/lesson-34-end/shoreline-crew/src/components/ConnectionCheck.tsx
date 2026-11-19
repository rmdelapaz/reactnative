import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { apiBaseUrl, describeError, getHealth } from '@/api/client';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { spacing } from '@/theme/spacing';

type Check =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'connected'; ms: number }
  | { kind: 'failed'; message: string };

// A wrong address on a Wi-Fi network can hang for a long time instead of failing: give up after this
const timeoutMs = 8000;

/** The address this build of the app talks to, or what is wrong with it */
function currentAddress(): string {
  try {
    return apiBaseUrl();
  } catch (error) {
    return describeError(error);
  }
}

// Which API this app talks to, and a button that asks it for an answer right now
export function ConnectionCheck() {
  const [check, setCheck] = useState<Check>({ kind: 'idle' });

  async function run() {
    setCheck({ kind: 'checking' });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const started = Date.now();
    try {
      await getHealth(controller.signal);
      setCheck({ kind: 'connected', ms: Date.now() - started });
    } catch (error) {
      setCheck({ kind: 'failed', message: describeError(error) });
    } finally {
      clearTimeout(timer);
    }
  }

  return (
    <View style={styles.box}>
      <AppText variant="heading" accessibilityRole="header">
        Connection
      </AppText>
      <AppText>This app talks to shoreline-api at:</AppText>
      <AppText selectable style={styles.address}>
        {currentAddress()}
      </AppText>
      <Button
        label={check.kind === 'checking' ? 'Checking…' : 'Check the connection'}
        onPress={run}
        disabled={check.kind === 'checking'}
      />
      {check.kind === 'connected' && (
        <AppText accessibilityLiveRegion="polite">
          Connected: the server answered in {check.ms} ms.
        </AppText>
      )}
      {check.kind === 'failed' && (
        <AppText variant="error" accessibilityRole="alert">
          {check.message}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: spacing.sm,
  },
  address: {
    fontWeight: '600',
  },
});
