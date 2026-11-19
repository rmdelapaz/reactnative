import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTheme } from '../hooks/useTheme';

export default function RootLayout() {
  const { scheme } = useTheme();
  return (
    <SafeAreaProvider>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      {/* The queue draws its own banner, so it needs no header bar */}
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
