import { Link } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';

// Any address with no screen in src/app ends up here, instead of Expo Router's own page
export default function NotFoundScreen() {
  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <AppText variant="heading" accessibilityRole="header">
        Page not found
      </AppText>
      <AppText>The link may be old, or mistyped.</AppText>
      {/* dismissTo: close screens back to the list, or take this screen's place (Lesson 4.4) */}
      <Link href="/" dismissTo asChild>
        <Button label="Back to the list" variant="primary" />
      </Link>
    </Screen>
  );
}
