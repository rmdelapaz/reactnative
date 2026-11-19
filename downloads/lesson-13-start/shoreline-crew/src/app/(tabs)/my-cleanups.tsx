import { Link } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';

// My cleanups: the cleanups you signed up for. Empty until volunteers can sign in and sign up.
export default function MyCleanupsScreen() {
  return (
    // The header bar covers the top and the tab bar the bottom: only the sides are left
    <Screen scroll edges={['left', 'right']}>
      <AppText variant="heading" accessibilityRole="header">
        No sign-ups yet
      </AppText>
      <AppText>
        When you sign up for a cleanup, it is listed here, with your place on the waiting list if
        it is full. Signing in and signing up are coming to Shoreline Crew soon.
      </AppText>
      {/* "/" is the Cleanups tab: a link to a tab's address switches to that tab */}
      <Link href="/" asChild>
        <Button label="Find a cleanup" variant="primary" />
      </Link>
    </Screen>
  );
}
