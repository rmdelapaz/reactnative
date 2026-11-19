import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, type ErrorBoundaryProps, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { queryClient } from '@/api/queries';
import { CrashScreen } from '@/components/CrashScreen';
import { useAppStateFocus } from '@/hooks/useAppStateFocus';
import { useOnlineManager } from '@/hooks/useOnlineManager';
import { useTheme } from '@/hooks/useTheme';

// A screen that throws shows CrashScreen instead of closing the app (Lesson 9.3)
export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <CrashScreen {...props} />;
}

export default function RootLayout() {
  const { scheme, colors } = useTheme();
  // What a browser tells TanStack Query by itself, a phone's app has to: back in the foreground,
  // and connection lost or found (Lesson 5.2)
  useAppStateFocus();
  useOnlineManager();

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        {/* Every file in src/app is a screen of this stack (Lesson 4.1). Add tabs (Lesson 4.2),
            sign-in and Stack.Protected (Lesson 4.3) when your brief needs them. */}
        <Stack screenOptions={{ headerBackTitle: 'Back' }}>
          <Stack.Screen name="index" options={{ title: 'Items' }} />
          {/* Until the item has loaded and its screen sets its own title */}
          <Stack.Screen name="items/[id]" options={{ title: 'Item' }} />
          <Stack.Screen name="new-item" options={{ presentation: 'modal', title: 'New item' }} />
          <Stack.Screen name="+not-found" options={{ title: 'Not found' }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
