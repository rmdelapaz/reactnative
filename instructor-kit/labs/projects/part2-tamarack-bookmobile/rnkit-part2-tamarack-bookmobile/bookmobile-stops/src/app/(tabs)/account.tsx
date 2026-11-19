import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { stopsQuery } from '@/api/queries';
import { signOut } from '@/auth/session';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { useSession } from '@/hooks/useSession';
import { changeMyStop, useMyStop } from '@/state/myStop';
import { spacing } from '@/theme/spacing';

// The Account tab (GIVEN): who is signed in, and My stop
export default function AccountScreen() {
  const session = useSession();
  const myStopId = useMyStop();
  const stops = useQuery(stopsQuery());
  const myStop = stops.data?.find((stop) => stop.id === myStopId);

  return (
    <Screen>
      <Card>
        <AppText variant="heading" accessibilityRole="header">
          Library card
        </AppText>
        {session === null ? (
          <>
            <AppText>You are not signed in.</AppText>
            <Link href="/sign-in" asChild>
              <Button label="Sign in" variant="primary" />
            </Link>
          </>
        ) : (
          <>
            <AppText>Signed in as {session.patron.name}</AppText>
            <AppText variant="muted">Card ending {session.patron.cardNumber.slice(-4)}</AppText>
            <Button label="Sign out" onPress={signOut} />
          </>
        )}
      </Card>
      <Card>
        <AppText variant="heading" accessibilityRole="header">
          My stop
        </AppText>
        {myStop === undefined ? (
          <AppText>No stop chosen yet. Pick one on the Stops tab.</AppText>
        ) : (
          <View style={styles.row}>
            <AppText>My stop: {myStop.name}</AppText>
            <Button label="Clear my stop" onPress={() => changeMyStop(null)} />
          </View>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
  },
});
