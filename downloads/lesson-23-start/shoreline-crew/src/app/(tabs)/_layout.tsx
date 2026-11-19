import { Tabs } from 'expo-router/js-tabs';

import { Icon } from '@/components/Icon';
import { useSession } from '@/hooks/useSession';
import { useTheme } from '@/hooks/useTheme';
import { useLogQueue } from '@/state/logQueue';
import { fonts } from '@/theme/typography';

// The tab bar: the four places a volunteer goes back to all the time.
// The (tabs) folder adds nothing to the address: this tab's Cleanups screen is still "/".
export default function TabLayout() {
  const { colors } = useTheme();
  // How many of the signed-in volunteer's logs are not on the server yet (a number: no useShallow)
  const session = useSession();
  const unsent = useLogQueue(
    (state) => state.logs.filter((item) => item.volunteerId === session?.user.id).length,
  );

  return (
    <Tabs
      screenOptions={{
        headerTitleStyle: { fontFamily: fonts.heading },
        tabBarActiveTintColor: colors.action, // the tab you are on
        tabBarInactiveTintColor: colors.textMuted, // the others, still easy to read
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Cleanups',
          headerShown: false, // the Cleanups screen draws its own banner
          tabBarIcon: ({ color, size }) => <Icon name="cleanups" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="my-cleanups"
        options={{
          title: 'My cleanups',
          tabBarIcon: ({ color, size }) => <Icon name="myCleanups" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="logbook"
        options={{
          title: 'Logbook',
          tabBarIcon: ({ color, size }) => <Icon name="logbook" color={color} size={size} />,
          // A small count on the tab while logs wait, and the same news for a screen reader
          tabBarBadge: unsent > 0 ? unsent : undefined,
          tabBarAccessibilityLabel: unsent > 0 ? `Logbook, ${unsent} not sent yet` : 'Logbook',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Icon name="profile" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
