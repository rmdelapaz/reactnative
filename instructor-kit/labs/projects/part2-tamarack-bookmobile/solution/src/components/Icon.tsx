import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

// Every icon the app uses, by its job: an SF Symbol for iOS, a Material Symbol for Android and the web
const icons = {
  stops: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' },
  books: { ios: 'books.vertical', android: 'menu_book', web: 'menu_book' },
  holds: { ios: 'bookmark', android: 'bookmark', web: 'bookmark' },
  account: { ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' },
} satisfies Record<string, SymbolViewProps['name']>;

export type IconName = keyof typeof icons;

// A decorative icon: the words beside it say what it means, so screen readers skip it
export function Icon({ name, size = 24, color }: { name: IconName; size?: number; color: ColorValue }) {
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
