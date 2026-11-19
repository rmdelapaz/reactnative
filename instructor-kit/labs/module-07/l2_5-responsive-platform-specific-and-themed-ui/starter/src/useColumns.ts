import { Dimensions } from 'react-native';

// Task 3: one column on a phone, two from 700 wide (a tablet, a phone on its side, a wide browser window). This
// reads the width ONCE, when the file is first loaded, and never again. Turn it into a hook that follows the window.
const { width } = Dimensions.get('window');

export function useColumns() {
  return width >= 700 ? 2 : 1;
}
