import { Stack } from 'expo-router';

// The root layout: every route in app/ is a screen of this stack
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="index" options={{ title: 'Beach sites' }} />
      {/* Until the site's screen sets its own title */}
      <Stack.Screen name="sites/[id]" options={{ title: 'Site' }} />
      <Stack.Screen name="+not-found" options={{ title: 'Not found' }} />
    </Stack>
  );
}
