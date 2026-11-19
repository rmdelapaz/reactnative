import { Stack } from 'expo-router';

// Whatever address the app opens at, the tabs are underneath it: a screen opened by a link has a back
// button, and back leads to the Cleanups tab. The anchor names a screen of THIS layout.
export const unstable_settings = {
  anchor: '(tabs)',
};

// The root stack: the tabs, and a cleanup screen that a card (or a link) opens on top of them
export function RootStack() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="cleanups/[id]" options={{ title: 'Cleanup' }} />
    </Stack>
  );
}
