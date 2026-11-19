import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { ApiError, getMe } from '@/api/client';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { signOut } from '@/auth/session';
import { useSession } from '@/hooks/useSession';

// Profile: who you are, signing in and out, and the beach safety guide
export default function ProfileScreen() {
  const session = useSession();
  const token = session?.token;
  // true when the API said this phone's sign-in has ended (it restarted, or the session expired)
  const [ended, setEnded] = useState(false);

  // Each time Profile comes into view, ask the API whether it still knows this sign-in.
  // A 401 makes the client forget the session, and this screen shows the signed-out view.
  useFocusEffect(
    useCallback(() => {
      if (token === undefined) {
        return;
      }
      const controller = new AbortController();
      getMe(controller.signal).catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 401) {
          setEnded(true);
        }
        // Anything else (no signal, the API not running): stay signed in and check next time
      });
      return () => controller.abort();
    }, [token]),
  );

  function signOutNow() {
    setEnded(false);
    signOut();
  }

  return (
    <Screen scroll edges={['left', 'right']}>
      {session === null ? (
        <>
          <AppText variant="heading" accessibilityRole="header">
            Not signed in
          </AppText>
          {ended && (
            <AppText variant="error" accessibilityRole="alert">
              Your sign-in has ended. Sign in again.
            </AppText>
          )}
          <AppText>Sign in to sign up for cleanups and to see the ones you signed up for.</AppText>
          {/* The sign-in modal; it closes by itself once you are signed in */}
          <Link href="/sign-in" asChild>
            <Button label="Sign in" variant="primary" />
          </Link>
        </>
      ) : (
        <>
          <AppText variant="heading" accessibilityRole="header">
            {session.user.name}
          </AppText>
          <AppText variant="muted">{session.user.email}</AppText>
          <AppText>
            Signed in as {session.user.role === 'organizer' ? 'an organizer' : 'a volunteer'}.
          </AppText>
          <Button label="Sign out" onPress={signOutNow} />
        </>
      )}
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
