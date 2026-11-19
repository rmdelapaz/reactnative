import { Stack } from 'expo-router';

// TODO 3a: the Cleanups list is (tabs)/index.tsx, so its name goes here... or does it? Read the error.
export const unstable_settings = {
  anchor: 'index',
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
