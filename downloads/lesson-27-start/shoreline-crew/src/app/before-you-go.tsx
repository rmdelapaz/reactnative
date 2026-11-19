import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { spacing } from '@/theme/spacing';

type Tips = { heading: string; tips: string[] };

// The crew's safety briefing, in three parts
const briefing: Tips[] = [
  {
    heading: 'Bring',
    tips: [
      'Closed shoes you do not mind getting wet',
      'Water, a hat and sunscreen',
      'A warm layer: the coast is often colder than town',
    ],
  },
  {
    heading: 'On the beach',
    tips: [
      'Wear the gloves we bring whenever you pick something up',
      'Never pick up needles or broken glass: mark the spot and tell your crew leader',
      'Watch the tide, and stay off wet rocks',
      'Give birds, seals and nests plenty of space',
    ],
  },
  {
    heading: 'Afterwards',
    tips: ['Wash your hands before you eat', 'Log what the crew collected'],
  },
];

// A modal screen: it slides up over whatever was showing, and Done puts it away again
export default function BeforeYouGoScreen() {
  // Opened from inside the app, the screen underneath is still there; opened from its
  // address, nothing is underneath, so the Cleanups screen takes its place
  function done() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  return (
    // The modal has its own header bar at the top
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <AppText>Read this before your first cleanup, and again when the weather turns.</AppText>
      {briefing.map(({ heading, tips }) => (
        <View key={heading} style={styles.part}>
          <AppText variant="heading" accessibilityRole="header">
            {heading}
          </AppText>
          {tips.map((tip) => (
            <View key={tip} style={styles.tip}>
              <AppText aria-hidden>•</AppText>
              <AppText style={styles.text}>{tip}</AppText>
            </View>
          ))}
        </View>
      ))}
      <Button label="Done" variant="primary" onPress={done} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  part: {
    gap: spacing.sm,
  },
  tip: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  text: {
    flex: 1, // the tip wraps beside its bullet
  },
});
