import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';

import { meQuery, viewerId } from '@/api/queries';
import { useSignInEnded } from '@/auth/ended';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { type Choice, ChoiceGroup } from '@/components/ChoiceGroup';
import { ConnectionCheck } from '@/components/ConnectionCheck';
import { ReminderSettings } from '@/components/ReminderSettings';
import { Screen } from '@/components/Screen';
import { SwitchRow } from '@/components/SwitchRow';
import { signOut } from '@/auth/session';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useSession } from '@/hooks/useSession';
import { usePhoneReducesMotion } from '@/state/motion';
import { changeSettings, type ThemeChoice, useSettings } from '@/state/settings';

const themeChoices: Choice<ThemeChoice>[] = [
  { value: 'system', label: 'Phone setting' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

// Profile: who you are, signing in and out, how the app looks, reminders, and the beach safety guide
export default function ProfileScreen() {
  const session = useSession();
  const settings = useSettings();
  const phoneReducesMotion = usePhoneReducesMotion();
  // true when the API said this phone's sign-in has ended (any screen's request can find out)
  const ended = useSignInEnded();
  // Does the API still know this sign-in? A 401 here (or anywhere) signs the phone out, and the
  // cache's error handler marks the sign-in as ended. Nothing to ask for guests.
  useQuery({ ...meQuery(viewerId(session)), enabled: session !== null });
  // Coming back to Profile asks again, once the last answer is older than 30 seconds
  useRefreshOnFocus('me');

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
          <Button label="Sign out" onPress={signOut} />
        </>
      )}
      <AppText variant="heading" accessibilityRole="header">
        Appearance
      </AppText>
      {/* Saved on this phone: the app opens in the same theme next time */}
      <ChoiceGroup
        label="Theme"
        choices={themeChoices}
        value={settings.theme}
        onChange={(theme) => changeSettings({ theme })}
      />
      {/* On by default; the phone's own vibration settings still have the last word */}
      <SwitchRow
        label="Vibrate when a sign-up or a log goes through"
        value={settings.hapticsOn}
        onValueChange={(hapticsOn) => changeSettings({ hapticsOn })}
      />
      {/* Off by default: the phone's own Reduce Motion is the first word, this switch only adds */}
      <SwitchRow
        label="Reduce motion in this app"
        value={settings.reduceMotion}
        onValueChange={(reduceMotion) => changeSettings({ reduceMotion })}
      />
      <AppText variant="muted">
        {phoneReducesMotion
          ? 'Your phone asks for less motion, so the app uses less, whatever this switch says.'
          : 'Counting, sliding and bouncing stop; fades stay. Your phone setting counts too.'}
      </AppText>
      {/* Off until the volunteer turns it on: only then does the phone ask about notifications */}
      <ReminderSettings />
      <AppText variant="heading" accessibilityRole="header">
        Before every cleanup
      </AppText>
      <AppText>What to bring, and how to stay safe on the beach.</AppText>
      {/* A modal: it slides up over the tabs, and closes back to this tab */}
      <Link href="/before-you-go" asChild>
        <Button label="Before you go" />
      </Link>
      {/* Which API this build talks to: the first thing to check when a phone shows no cleanups */}
      <ConnectionCheck />
    </Screen>
  );
}
