import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

// Every icon the app uses, named by its job: an SF Symbol for iOS, a Material Symbol for
// Android and the web. A plain SF Symbol name alone draws nothing on Android or the web.
const icons = {
  date: { ios: 'calendar', android: 'calendar_today', web: 'calendar_today' },
  place: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' },
  meet: { ios: 'person.2', android: 'group', web: 'group' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  clear: { ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' },
  // The tab bar
  cleanups: { ios: 'list.bullet', android: 'format_list_bulleted', web: 'format_list_bulleted' },
  myCleanups: { ios: 'calendar.badge.checkmark', android: 'event_available', web: 'event_available' },
  logbook: { ios: 'book.closed', android: 'menu_book', web: 'menu_book' },
  profile: { ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' },
} satisfies Record<string, SymbolViewProps['name']>;

export type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  size?: number;
  color?: ColorValue;
};

// A decorative icon: the words beside it say what it means, so screen readers skip it
export function Icon({ name, size = 20, color }: IconProps) {
  const { colors } = useTheme();
  return (
    <SymbolView
      name={icons[name]}
      size={size}
      tintColor={color ?? colors.icon} // the theme's icon color unless the caller picks one
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
