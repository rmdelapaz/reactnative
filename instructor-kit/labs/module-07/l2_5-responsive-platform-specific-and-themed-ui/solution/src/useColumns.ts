import { useWindowDimensions } from 'react-native';

// One column on a phone, two from 700 wide: the window right now, and again whenever it changes size
export function useColumns() {
  const { width } = useWindowDimensions();
  return width >= 700 ? 2 : 1;
}
