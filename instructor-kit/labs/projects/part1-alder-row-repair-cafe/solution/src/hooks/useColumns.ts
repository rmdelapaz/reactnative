import { useWindowDimensions } from 'react-native';

import { layout } from '../theme/spacing';

// 1 card per row on a phone, 2 on a wider screen; re-renders when the window changes size
export function useColumns() {
  const { width } = useWindowDimensions();
  return width >= layout.twoColumns ? 2 : 1;
}
