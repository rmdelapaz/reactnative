import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import { queryClient } from '@/api/queries';
import { loadSession } from '@/auth/session';
import { useAppStateFocus } from '@/hooks/useAppStateFocus';
import { useOnlineManager } from '@/hooks/useOnlineManager';
import { useReminders } from '@/hooks/useReminders';
import { useReminderTaps } from '@/hooks/useReminderTaps';
import { useSendWaitingLogs } from '@/hooks/useSendWaitingLogs';
import { useSession } from '@/hooks/useSession';
import { useTheme } from '@/hooks/useTheme';
import { loadLogQueue } from '@/state/logQueue';
import { loadSettings } from '@/state/settings';
import { fontFiles, fonts } from '@/theme/typography';

// Keep the splash screen up while the fonts, the session, the settings and the queue of unsent
// debris logs load (once, at startup)
SplashScreen.preventAutoHideAsync();

// Whatever address the app opens at, the tabs are underneath it. A link straight to a cleanup
// then has a back button, and back leads to the Cleanups tab instead of out of the app.
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontFiles);
  // Reading the phone's storage is async: until it answers, the app cannot know who is signed in,
  // or which theme to draw the first screen in
  const [savedLoaded, setSavedLoaded] = useState(false);
  const session = useSession();
  // If a font fails to load, carry on with the system font rather than a splash screen forever
  const ready = (fontsLoaded || fontError !== null) && savedLoaded;
  const { scheme, colors } = useTheme();
  // What a browser tells TanStack Query by itself, a phone's app has to: back in the foreground,
  // and connection lost or found
  useAppStateFocus();
  useOnlineManager();
  // Once the saved queue is loaded, whoever is signed in sends their waiting logs
  useSendWaitingLogs(savedLoaded && session !== null ? session.user.id : null);
  // The reminders before each cleanup follow the sign-ups, and a tap on one opens its cleanup
  useReminders(savedLoaded);
  useReminderTaps(ready);

  useEffect(() => {
    Promise.all([loadSession(), loadSettings(), loadLogQueue()]).finally(() =>
      setSavedLoaded(true),
    );
  }, []);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null; // the splash screen is still showing
  }

  // The navigator's own colors (headers, the background behind screens), taken from our theme
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.action,
      background: colors.page,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    // The one cache, for every screen (as in the HQ)
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        {/* Dark clock and battery icons on a light page, light ones on a dark page */}
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        {/* Every screen in src/app is a screen of this stack. These options apply to all of them... */}
        <Stack
          screenOptions={{
            headerTitleStyle: { fontFamily: fonts.heading },
            // The back button's words. Left alone, it shows the previous screen's title, and under
            // the tabs that is the folder's name, "(tabs)"
            headerBackTitle: 'Back',
          }}
        >
          {/* ...and these to one. The tabs are ONE screen of this stack, with their own headers */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* Until the cleanup has loaded and its screen sets its own title */}
          <Stack.Screen name="cleanups/[id]" options={{ title: 'Cleanup' }} />
          <Stack.Screen name="+not-found" options={{ title: 'Not found' }} />
          {/* A modal: it slides up over the tabs or a cleanup, instead of being pushed from the side */}
          <Stack.Screen
            name="before-you-go"
            options={{ presentation: 'modal', title: 'Before you go' }}
          />
          {/* The debris log form. Open to everyone, so a link to it always lands: a guest is asked
              to sign in on the screen itself (a guarded screen would send them away silently) */}
          <Stack.Screen name="log/[id]" options={{ presentation: 'modal', title: 'Log debris' }} />
          {/* Check in at the beach on the day, with the organizer's code. Open to everyone too */}
          <Stack.Screen name="check-in/[id]" options={{ presentation: 'modal', title: 'Check in' }} />
          {/* Only for people who are not signed in: signing in takes this screen away */}
          <Stack.Protected guard={session === null}>
            <Stack.Screen name="sign-in" options={{ presentation: 'modal', title: 'Sign in' }} />
          </Stack.Protected>
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
