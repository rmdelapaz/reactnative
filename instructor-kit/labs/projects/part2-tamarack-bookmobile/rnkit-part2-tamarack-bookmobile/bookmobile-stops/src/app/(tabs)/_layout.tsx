import { Tabs } from 'expo-router/js-tabs';

import { Icon } from '@/components/Icon';
import { useSession } from '@/hooks/useSession';
import { useTheme } from '@/hooks/useTheme';
import { useHoldQueue } from '@/state/holdQueue';

// TODO R1a (done). The tab bar: the four places a patron goes back to (Lesson 4.2).
// The (tabs) folder adds nothing to the address: the Stops tab is still "/".
export default function TabLayout() {
  const { colors } = useTheme();
  const session = useSession();
  // How many of the signed-in patron's holds wait on this phone (a number: no useShallow needed)
  const waiting = useHoldQueue(
    (state) => state.holds.filter((hold) => hold.patronId === session?.patron.id && hold.status === 'waiting').length,
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.action,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Stops', tabBarIcon: ({ color, size }) => <Icon name="stops" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="books"
        options={{ title: 'Books', tabBarIcon: ({ color, size }) => <Icon name="books" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="holds"
        options={{
          title: 'Holds',
          tabBarIcon: ({ color, size }) => <Icon name="holds" color={color} size={size} />,
          // A small count while holds wait, and the same news for a screen reader
          tabBarBadge: waiting > 0 ? waiting : undefined,
          tabBarAccessibilityLabel: waiting > 0 ? `Holds, ${waiting} not sent yet` : undefined,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{ title: 'Account', tabBarIcon: ({ color, size }) => <Icon name="account" color={color} size={size} /> }}
      />
    </Tabs>
  );
}
