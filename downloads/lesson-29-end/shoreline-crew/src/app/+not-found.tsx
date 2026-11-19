import { Link } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';

// Any address with no screen in src/app ends up here, instead of Expo Router's own page
export default function NotFoundScreen() {
  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <AppText variant="heading" accessibilityRole="header">
        This page is not on the map
      </AppText>
      <AppText>The link may be old, or mistyped. The cleanups are all on the first screen.</AppText>
      {/* dismissTo: close screens back to the tabs underneath (the anchor), or take this screen's
          place when there is nothing underneath. Back never returns to a dead end. */}
      <Link href="/" dismissTo asChild>
        <Button label="Back to the cleanups" variant="primary" />
      </Link>
    </Screen>
  );
}
