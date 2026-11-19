import { Link } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';

// Profile: who you are and your settings. Until volunteers can sign in, the beach safety guide.
export default function ProfileScreen() {
  return (
    <Screen scroll edges={['left', 'right']}>
      <AppText variant="heading" accessibilityRole="header">
        Not signed in
      </AppText>
      <AppText>
        Signing in is coming to Shoreline Crew soon. Then this tab shows who you are, and your
        settings.
      </AppText>
      <AppText variant="heading" accessibilityRole="header">
        Before every cleanup
      </AppText>
      <AppText>What to bring, and how to stay safe on the beach.</AppText>
      {/* A modal: it slides up over the tabs, and closes back to this tab */}
      <Link href="/before-you-go" asChild>
        <Button label="Before you go" />
      </Link>
    </Screen>
  );
}
