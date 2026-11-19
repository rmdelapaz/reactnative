// Explain, then ask; take a no; point to Settings when only Settings can help.
// The feature inside renders only after a yes.
import * as Linking from 'expo-linking';
import { type ReactNode, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Permission } from './usePermission';

type AskFirstProps = {
  permission: Permission;
  what: string; // "your microphone"
  why: string; // what it is for, said before the phone asks
  onNotNow: () => void; // a way out that asks nothing
  children: ReactNode; // the feature
};

function Action({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" style={styles.button} onPress={onPress}>
      <Text>{label}</Text>
    </Pressable>
  );
}

export function AskFirst({ permission, what, why, onNotNow, children }: AskFirstProps) {
  const [noSettings, setNoSettings] = useState(false); // no Settings app here (the web preview)

  // TODO 2a: "get the question out of the way" as soon as the gate appears. Ask from the button
  // instead: the press is the moment the question makes sense.
  useEffect(() => {
    void permission.ask();
  }, []);

  async function openSettings() {
    // TODO 2c: there is no Settings app in the web preview: openSettings throws there. Catch it
    // and show the browser note with Check again (noSettings) instead of a button that does nothing.
    await Linking.openSettings();
  }

  switch (permission.step) {
    case 'checking':
      return <Text>Checking…</Text>;
    case 'granted':
      return children;
    case 'not-asked':
      return (
        <View style={styles.box}>
          <Text>{why}</Text>
          <Text>Your phone asks next. You can change your answer at any time in Settings.</Text>
          {/* TODO 2b: the real "Allow" is the phone's: this button leads to the question */}
          <Action label="Allow" onPress={() => void permission.ask()} />
          <Action label="Not now" onPress={onNotNow} />
        </View>
      );
    case 'denied':
      return (
        <View style={styles.box}>
          <Text accessibilityLiveRegion="polite">
            Shoreline Crew does not have {what}, and that is fine: everything else works without it.
          </Text>
          <Action label="Ask me again" onPress={() => void permission.ask()} />
          <Action label="Not now" onPress={onNotNow} />
        </View>
      );
    case 'blocked':
      return (
        <View style={styles.box}>
          <Text accessibilityLiveRegion="polite">
            Shoreline Crew is not allowed to use {what}. Your phone will not ask again: you can turn it
            on in Settings, then come back here.
          </Text>
          {noSettings ? (
            <>
              <Text>There is no Settings app here: allow it in the site settings of the browser.</Text>
              <Action label="Check again" onPress={() => void permission.check()} />
            </>
          ) : (
            <Action label="Open Settings" onPress={() => void openSettings()} />
          )}
          <Action label="Not now" onPress={onNotNow} />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  box: { gap: 8 },
  button: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1 },
});
