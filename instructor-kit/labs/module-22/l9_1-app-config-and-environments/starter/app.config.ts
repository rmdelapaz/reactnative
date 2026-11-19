// Shoreline Lookout's app config: a crew leader's beach-conditions app (Lab 9.1).
// TODO 1: three variants chosen by APP_VARIANT (development by default), each with its own name and app id;
//         and npm run typecheck names one misspelled key below
// TODO 2: production refuses an EXPO_PUBLIC_API_URL that does not start with https://; only development gets
//         its own link scheme, shorelinelookout-dev
// TODO 3: the Maps key comes from ANDROID_GOOGLE_MAPS_API_KEY, never from this file
import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Shoreline Lookout',
  slug: 'shoreline-lookout',
  version: '1.0.0',
  scheme: 'shorelinelookout',
  ios: {
    bundleIdentifier: 'com.example.shorelinelookout',
  },
  android: {
    pacakge: 'com.example.shorelinelookout',
  },
  plugins: [
    [
      'expo-location',
      {
        locationWhenInUsePermission: 'Shoreline Lookout uses your location to show the beach nearest to you.',
        locationAlwaysAndWhenInUsePermission: false,
        locationAlwaysPermission: false,
      },
    ],
    ['react-native-maps', { androidGoogleMapsApiKey: 'key-pasted-into-the-code' }],
  ],
});
