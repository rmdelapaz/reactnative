import { Tabs } from 'expo-router/js-tabs';

// TODO R1a. The tab bar: the four places a patron goes back to (Lesson 4.2). Expo Router finds the
// four screens in this folder by itself, but names them after their files ("index", "books", ...).
// Give each Tabs.Screen its title (Stops, Books, Holds, Account, in that order) and an icon
// (src/components/Icon.tsx), the active tint from the theme (useTheme), and on the Holds tab the
// number of the signed-in patron's holds still waiting on this phone: tabBarBadge, and
// tabBarAccessibilityLabel "Holds, 2 not sent yet" (just "Holds" when none wait).
export default function TabLayout() {
  return <Tabs />;
}
