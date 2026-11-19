// Shoreline Lookout's app config: a crew leader's beach-conditions app (Lab 9.1), three variants of one project
import type { ConfigContext, ExpoConfig } from 'expo/config';

const variants = {
  development: { name: 'Lookout Dev', appId: 'com.example.shorelinelookout.dev' },
  preview: { name: 'Lookout Preview', appId: 'com.example.shorelinelookout.preview' },
  production: { name: 'Shoreline Lookout', appId: 'com.example.shorelinelookout' },
};
type Variant = keyof typeof variants;

function isVariant(value: string): value is Variant {
  return Object.hasOwn(variants, value);
}

// APP_VARIANT picks the variant; nothing set means development, so a forgotten setting never makes the store app
const variant = process.env.APP_VARIANT ?? 'development';
if (!isVariant(variant)) {
  throw new Error(`APP_VARIANT must be development, preview or production, not "${variant}".`);
}

// A store build must not talk plain http (release builds block it, and anyone on the Wi-Fi could read it)
const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? '';
if (variant === 'production' && !apiUrl.startsWith('https://')) {
  throw new Error(`A production build needs an https:// EXPO_PUBLIC_API_URL, not "${apiUrl}".`);
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: variants[variant].name,
  slug: 'shoreline-lookout',
  version: '1.0.0',
  // With the development build and the store app on one phone, a link should open the right one
  scheme: variant === 'development' ? 'shorelinelookout-dev' : 'shorelinelookout',
  ios: {
    bundleIdentifier: variants[variant].appId,
  },
  android: {
    package: variants[variant].appId,
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
    // A key from .env.local or the build service's secrets: never written in this file
    ['react-native-maps', { androidGoogleMapsApiKey: process.env.ANDROID_GOOGLE_MAPS_API_KEY }],
  ],
});
