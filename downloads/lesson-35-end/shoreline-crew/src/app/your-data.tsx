import { router } from 'expo-router';
import { Linking, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { spacing } from '@/theme/spacing';
import {
  accountDeletionUrl,
  type DataFact,
  keptOnPhone,
  notCollected,
  privacyPolicyUrl,
  sentToServer,
} from '@/utils/privacy';

// Your data (Lesson 9.4): what leaves the phone, what stays, the privacy policy, and how to ask
// for your account to be deleted. A modal, like Before you go.
export default function YourDataScreen() {
  function done() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <AppText>What Shoreline Crew sends, what stays on your phone, and how to leave.</AppText>
      <Facts heading="Sent to your crew's server" facts={sentToServer} />
      <Facts heading="Only on this phone" facts={keptOnPhone} />
      <AppText variant="muted">{notCollected}</AppText>
      <AppText variant="heading" accessibilityRole="header">
        Your account
      </AppText>
      {/* Honest about the server: shoreline-api has no way to delete an account, so the request
          goes to the organizers through a web page (a real app would also delete it in the app) */}
      <AppText>
        Your crew&apos;s organizers made your account, and they keep it with your sign-ups, logs and
        photos. To have all of it deleted, ask on the crew&apos;s web page: it says how long it
        takes.
      </AppText>
      <Button
        label="Ask to delete my account"
        accessibilityRole="link"
        accessibilityHint="Opens a web page"
        onPress={() => Linking.openURL(accountDeletionUrl)}
      />
      <Button
        label="Read the privacy policy"
        accessibilityRole="link"
        accessibilityHint="Opens a web page"
        onPress={() => Linking.openURL(privacyPolicyUrl)}
      />
      <Button label="Done" variant="primary" onPress={done} />
    </Screen>
  );
}

function Facts({ heading, facts }: { heading: string; facts: DataFact[] }) {
  return (
    <View style={styles.part}>
      <AppText variant="heading" accessibilityRole="header">
        {heading}
      </AppText>
      {facts.map(({ what, detail }) => (
        // One element for a screen reader: what, then the detail
        <View key={what} accessible style={styles.fact}>
          <AppText style={styles.what}>{what}</AppText>
          <AppText variant="muted">{detail}</AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  part: {
    gap: spacing.sm,
  },
  fact: {
    gap: spacing.xs,
  },
  what: {
    fontWeight: '600',
  },
});
