import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useTheme } from '@/hooks/useTheme';
import { fontFiles } from '@/theme/typography';

// Keep the splash screen up while the fonts load (runs once, when the app starts)
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontFiles);
  // If a font fails to load, carry on with the system font rather than a splash screen forever
  const ready = fontsLoaded || fontError !== null;
  const { scheme, colors } = useTheme();

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
    <ThemeProvider value={navigationTheme}>
      {/* Dark clock and battery icons on a light page, light ones on a dark page */}
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        {/* The Cleanups screen draws its own banner, so it needs no header bar */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
