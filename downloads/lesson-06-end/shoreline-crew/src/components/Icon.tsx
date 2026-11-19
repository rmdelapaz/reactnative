import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

import { colors } from '@/theme/colors';

// Every icon the app uses, named by its job: an SF Symbol for iOS, a Material Symbol for
// Android and the web. A plain SF Symbol name alone draws nothing on Android or the web.
const icons = {
  date: { ios: 'calendar', android: 'calendar_today', web: 'calendar_today' },
  place: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' },
  meet: { ios: 'person.2', android: 'group', web: 'group' },
} satisfies Record<string, SymbolViewProps['name']>;

export type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  size?: number;
  color?: ColorValue;
};

// A decorative icon: the words beside it say what it means, so screen readers skip it
export function Icon({ name, size = 20, color = colors.icon }: IconProps) {
  return (
    <SymbolView
      name={icons[name]}
      size={size}
      tintColor={color}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
