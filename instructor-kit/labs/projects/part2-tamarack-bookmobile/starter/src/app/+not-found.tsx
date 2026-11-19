import { Link } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';

// Any address the app has no screen for
export default function NotFoundScreen() {
  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <AppText variant="heading" accessibilityRole="header">
        This page is not on the bookmobile&apos;s route.
      </AppText>
      <Link href="/" asChild>
        <Button label="See all stops" variant="primary" />
      </Link>
    </Screen>
  );
}
