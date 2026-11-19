import { Link } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { useSession } from '@/hooks/useSession';

// My cleanups: the cleanups you signed up for. Your sign-ups come from the API once you are signed in.
export default function MyCleanupsScreen() {
  const session = useSession();

  if (session === null) {
    return (
      <Screen scroll edges={['left', 'right']}>
        <AppText variant="heading" accessibilityRole="header">
          Sign in to see your cleanups
        </AppText>
        <AppText>
          The cleanups you sign up for are listed here, with your place on the waiting list if one
          is full.
        </AppText>
        <Link href="/sign-in" asChild>
          <Button label="Sign in" variant="primary" />
        </Link>
      </Screen>
    );
  }

  return (
    // The header bar covers the top and the tab bar the bottom: only the sides are left
    <Screen scroll edges={['left', 'right']}>
      <AppText variant="heading" accessibilityRole="header">
        No sign-ups yet
      </AppText>
      <AppText>
        When you sign up for a cleanup, it is listed here, with your place on the waiting list if
        it is full. Signing up is coming to Shoreline Crew soon.
      </AppText>
      {/* "/" is the Cleanups tab: a link to a tab's address switches to that tab */}
      <Link href="/" asChild>
        <Button label="Find a cleanup" variant="primary" />
      </Link>
    </Screen>
  );
}
