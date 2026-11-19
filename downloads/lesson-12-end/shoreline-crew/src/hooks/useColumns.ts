import { useWindowDimensions } from 'react-native';

import { layout } from '@/theme/spacing';

// How many cards fit side by side in the window right now: 1 on a phone, 2 on a wider screen.
// useWindowDimensions re-renders the component whenever the window changes size.
export function useColumns() {
  const { width } = useWindowDimensions();
  return width >= layout.twoColumns ? 2 : 1;
}
