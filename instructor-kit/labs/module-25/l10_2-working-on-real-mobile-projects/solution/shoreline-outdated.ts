// The lesson's own `npm outdated` card (Lesson 10.2, "Keeping an App Healthy"), as data. Do not edit.
import type { OutdatedRow } from './outdated.ts';

export const shorelineOutdated: OutdatedRow[] = [
  { name: '@lottiefiles/dotlottie-react', current: '0.13.5', wanted: '0.13.5', latest: '0.22.2' },
  { name: '@react-native-async-storage/async-storage', current: '2.2.0', wanted: '2.2.0', latest: '3.1.1' },
  { name: '@shopify/flash-list', current: '2.3.2', wanted: '2.3.2', latest: '2.3.3' },
  { name: 'eslint', current: '9.39.5', wanted: '9.39.5', latest: '10.15.0' },
  { name: 'react', current: '19.3.0', wanted: '19.3.0', latest: '19.3.1' },
  { name: 'react-dom', current: '19.3.0', wanted: '19.3.0', latest: '19.3.1' },
  { name: 'react-native-gesture-handler', current: '3.3.0', wanted: '3.3.0', latest: '3.5.0' },
  { name: 'react-native-worklets', current: '0.13.0', wanted: '0.13.0', latest: '0.13.1' },
  { name: 'typescript', current: '6.0.3', wanted: '6.0.3', latest: '7.0.2' },
];

// Expo SDK 58's version table for some of the course app's native packages (from the `expo` package's
// bundledNativeModules.json): the versions `npx expo install` picks. Do not edit.
export const sdk58: Record<string, string> = {
  '@react-native-async-storage/async-storage': '2.2.0',
  '@shopify/flash-list': '2.3.2',
  'expo-image-picker': '~58.0.10',
  react: '19.3.0',
  'react-dom': '19.3.0',
  'react-native': '0.88.1',
  'react-native-gesture-handler': '~3.3.0',
  'react-native-reanimated': '4.7.1',
  'react-native-worklets': '0.13.0',
};
