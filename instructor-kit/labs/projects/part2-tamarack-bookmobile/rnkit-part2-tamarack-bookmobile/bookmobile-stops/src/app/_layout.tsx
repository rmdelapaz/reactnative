import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import { queryClient } from '@/api/queries';
import { loadSession } from '@/auth/session';
import { useAppStateFocus } from '@/hooks/useAppStateFocus';
import { useOnlineManager } from '@/hooks/useOnlineManager';
import { useSendWaitingHolds } from '@/hooks/useSendWaitingHolds';
import { useSession } from '@/hooks/useSession';
import { useTheme } from '@/hooks/useTheme';
import { loadHoldQueue } from '@/state/holdQueue';
import { loadMyStop } from '@/state/myStop';

// Keep the splash screen up while the session, My stop and the queue of unsent holds load
SplashScreen.preventAutoHideAsync();

// Whatever address the app opens at, the tabs are underneath it (Lesson 4.4): a link straight to
// a stop has a back button, and back leads to the Stops tab
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [savedLoaded, setSavedLoaded] = useState(false);
  const session = useSession();
  const { scheme, colors } = useTheme();
  // What a browser tells TanStack Query by itself, a phone's app has to (Lesson 5.2)
  useAppStateFocus();
  useOnlineManager();
  // Once the saved queue is loaded, whoever is signed in sends their waiting holds (Lesson 5.5)
  useSendWaitingHolds(savedLoaded && session !== null ? session.patron.id : null);

  useEffect(() => {
    Promise.allSettled([loadSession(), loadMyStop(), loadHoldQueue()]).finally(() => setSavedLoaded(true));
  }, []);

  useEffect(() => {
    if (savedLoaded) {
      SplashScreen.hideAsync();
    }
  }, [savedLoaded]);

  if (!savedLoaded) {
    return null; // the splash screen is still showing
  }

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerBackTitle: 'Back' }}>
          {/* The tabs are ONE screen of this stack, with their own headers */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="stops/[id]" options={{ title: 'Stop' }} />
          {/* The hold form: open to everyone, so a link to it always lands (a guest is asked to sign in there) */}
          <Stack.Screen name="hold/[bookId]" options={{ presentation: 'modal', title: 'Place a hold' }} />
          <Stack.Screen name="+not-found" options={{ title: 'Not found' }} />
          {/* Only for people who are not signed in: signing in takes this screen away (Lesson 4.3) */}
          <Stack.Protected guard={session === null}>
            <Stack.Screen name="sign-in" options={{ presentation: 'modal', title: 'Sign in' }} />
          </Stack.Protected>
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
