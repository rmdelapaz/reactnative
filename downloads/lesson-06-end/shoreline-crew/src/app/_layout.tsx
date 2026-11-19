import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { fontFiles } from '@/theme/typography';

// Keep the splash screen up while the fonts load (runs once, when the app starts)
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontFiles);
  // If a font fails to load, carry on with the system font rather than a splash screen forever
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null; // the splash screen is still showing
  }

  return (
    <>
      {/* Dark clock and battery icons on the light Sand page (Lesson 2.5 follows the theme) */}
      <StatusBar style="dark" />
      <Stack>
        {/* The Cleanups screen draws its own banner, so it needs no header bar */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
