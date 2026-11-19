import { Tabs } from 'expo-router/js-tabs';

// The tab bar: three places a volunteer goes back to. The (tabs) folder adds nothing to the address.
// TODO 1: the Saved tab is missing from the bar. Each name must be a file in this folder, without .tsx.
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#1f6f8b' }}>
      <Tabs.Screen name="index" options={{ title: 'Sites', headerShown: false }} />
      <Tabs.Screen name="save" options={{ title: 'Saved' }} />
      <Tabs.Screen name="guide" options={{ title: 'Guide' }} />
    </Tabs>
  );
}
