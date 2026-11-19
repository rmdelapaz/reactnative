import { useWindowDimensions } from 'react-native';

// true when the person has made text at least one and a half times its normal size in the phone's
// settings: then rows of text side by side get too narrow, and a few layouts change shape.
// useWindowDimensions re-renders the component when the text size changes.
export function useLargeText() {
  const { fontScale } = useWindowDimensions();
  return fontScale >= 1.5;
}
