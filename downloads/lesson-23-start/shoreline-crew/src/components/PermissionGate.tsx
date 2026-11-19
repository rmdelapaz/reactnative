import * as Linking from 'expo-linking';
import { type ReactNode, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { LoadingView } from '@/components/LoadingView';
import type { Permission } from '@/hooks/usePermission';
import { spacing } from '@/theme/spacing';

type PermissionGateProps = {
  permission: Permission; // from usePermission()
  what: string; // what the app asks for, in words: "your location"
  why: string; // what it is for, said before the phone asks
  onNotNow?: () => void; // a way out that asks nothing
  children: ReactNode; // the feature, shown once the answer is yes
};

// Explain, then ask; take a no gracefully; point to Settings when only Settings can help.
// The feature inside renders only after a yes.
export function PermissionGate({ permission, what, why, onNotNow, children }: PermissionGateProps) {
  // Set when there is no Settings app to open (the web preview)
  const [noSettings, setNoSettings] = useState(false);

  async function openSettings() {
    try {
      await Linking.openSettings(); // this app's page in the phone's Settings
    } catch {
      setNoSettings(true);
    }
  }

  const notNow = onNotNow && <Button label="Not now" onPress={onNotNow} />;

  switch (permission.step) {
    case 'checking':
      return <LoadingView label="Checking…" />;
    case 'granted':
      return children;
    case 'not-asked':
      return (
        <View style={styles.box}>
          <AppText>{why}</AppText>
          <AppText variant="muted">
            Your phone asks next. You can change your answer at any time in Settings.
          </AppText>
          <View style={styles.actions}>
            <Button label="Continue" variant="primary" onPress={() => permission.ask()} />
            {notNow}
          </View>
        </View>
      );
    case 'denied':
      return (
        <View style={styles.box}>
          <AppText accessibilityLiveRegion="polite">
            Shoreline Crew does not have {what}, and that is fine: everything else works without it.
          </AppText>
          <AppText variant="muted">{why}</AppText>
          <View style={styles.actions}>
            <Button label="Ask me again" variant="primary" onPress={() => permission.ask()} />
            {notNow}
          </View>
        </View>
      );
    case 'blocked':
      return (
        <View style={styles.box}>
          <AppText accessibilityLiveRegion="polite">
            Shoreline Crew is not allowed to use {what}. Your phone will not ask again: you can turn
            it on in Settings, then come back here.
          </AppText>
          {noSettings && (
            <AppText variant="muted" accessibilityLiveRegion="polite">
              There is no Settings app here. In a browser, allow it in the site settings (the icon
              at the left of the address bar), then press Check again.
            </AppText>
          )}
          <View style={styles.actions}>
            {noSettings ? (
              <Button label="Check again" variant="primary" onPress={() => permission.check()} />
            ) : (
              <Button label="Open Settings" variant="primary" onPress={openSettings} />
            )}
            {notNow}
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  box: {
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
