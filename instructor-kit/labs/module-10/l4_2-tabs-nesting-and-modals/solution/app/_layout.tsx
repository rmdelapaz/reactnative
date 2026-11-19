import { Stack } from 'expo-router';

// The root stack: the tabs are ONE screen of it (with their own headers), a site opens on top of them,
// and the tide safety card is presented as a modal
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // Left alone, a back button shows the previous screen's title, and under the tabs that is "(tabs)"
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="sites/[id]" options={{ title: 'Site' }} />
      <Stack.Screen name="tide-safety" options={{ presentation: 'modal', title: 'Tide safety' }} />
    </Stack>
  );
}
