import { Stack } from 'expo-router';

// The root stack. TODO 2: the list moved into the (tabs) group, but this layout still names "index", and
// nothing hides this stack's header above the tab navigator. Name the group's route, hide its header, and give
// every back button the word "Back" (otherwise it shows the screen underneath's title: "(tabs)").
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="sites/[id]" options={{ title: 'Site' }} />
      <Stack.Screen name="tide-safety" options={{ presentation: 'modal', title: 'Tide safety' }} />
    </Stack>
  );
}
