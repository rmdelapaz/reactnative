// Shoreline Crew's app config: names, ids, icons, splash and the native settings of every build.
// Expo runs this file each time it needs the config (npx expo start, export, prebuild, EAS Build),
// so it can pick values for a variant and read the environment. It replaces app.json (Lesson 9.1).
import type { ConfigContext, ExpoConfig } from 'expo/config';

// One project, three apps that can sit side by side on a phone, each with its own name and id
const variants = {
  development: { name: 'Shoreline Dev', appId: 'com.example.shorelinecrew.dev' },
  preview: { name: 'Shoreline Preview', appId: 'com.example.shorelinecrew.preview' },
  production: { name: 'Shoreline Crew', appId: 'com.example.shorelinecrew' },
};
type Variant = keyof typeof variants;

function isVariant(value: string): value is Variant {
  return Object.hasOwn(variants, value);
}

// APP_VARIANT picks the variant: set it in the shell, or (Lesson 9.2) per build profile in eas.json
const variant = process.env.APP_VARIANT ?? 'development';
if (!isVariant(variant)) {
  throw new Error(`APP_VARIANT must be development, preview or production, not "${variant}".`);
}

// The API address is baked into the JavaScript (Lesson 5.1). A store build must not use plain http:
// Android and iOS block it in release builds, and anyone on the same Wi-Fi could read it.
const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? '';
if (variant === 'production' && !apiUrl.startsWith('https://')) {
  throw new Error(`A production build needs an https:// EXPO_PUBLIC_API_URL, not "${apiUrl}".`);
}

// A secret for Android builds only (Lesson 6.3): from the environment, never from this file
const googleMapsKey = process.env.ANDROID_GOOGLE_MAPS_API_KEY;

// Your project on expo.dev (Lesson 9.2). `npx eas-cli@latest init` creates it and prints both values,
// but cannot write them into a dynamic config: paste them here. They name the project; they are not secrets.
const easProject: { owner?: string; projectId?: string } = {};

// EAS Update (Lesson 9.3): updates come from your project's address on Expo's update service.
// Until easProject has an id there is no address, and builds run only the code they were built with.
const updatesUrl = easProject.projectId ? `https://u.expo.dev/${easProject.projectId}` : undefined;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: variants[variant].name,
  slug: 'shoreline-crew',
  owner: easProject.owner,
  version: '1.0.0',
  // An update only reaches builds with the same runtime version. The fingerprint policy computes it
  // from everything native (packages, plugins, ids, permissions), so it changes when a build must.
  runtimeVersion: { policy: 'fingerprint' },
  updates: { url: updatesUrl },
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'shorelinecrew',
  userInterfaceStyle: 'automatic',
  ios: {
    bundleIdentifier: variants[variant].appId,
    // App Store Connect asks every build about encryption (export rules). Shoreline Crew only uses
    // what the phone itself provides (https, the Keychain), which is exempt: answer once, here.
    config: { usesNonExemptEncryption: false },
  },
  android: {
    package: variants[variant].appId,
    // The template asks for "draw over other apps", which only development tools use. A store
    // build leaves it out, so the store page and the phone's settings do not list it (Lesson 9.4)
    blockedPermissions:
      variant === 'production' ? ['android.permission.SYSTEM_ALERT_WINDOW'] : [],
    adaptiveIcon: {
      backgroundColor: '#0b3954',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'server',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#fbf6ec',
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        // Dark mode: the page color the app itself uses at night, so nothing flashes bright
        dark: { backgroundColor: '#0f1b26', image: './assets/images/splash-icon.png' },
      },
    ],
    // No fingerprint or face unlock in the app: no Face ID question on iPhones
    ['expo-secure-store', { faceIDPermission: false }],
    'expo-sqlite',
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          "Shoreline Crew uses your location to show how far you are from a cleanup's meeting point.",
        locationAlwaysAndWhenInUsePermission: false,
        locationAlwaysPermission: false,
        motionUsagePermission: false,
        locationFullAccuracyPermission: false,
      },
    ],
    [
      'expo-image-picker',
      {
        cameraPermission:
          'Shoreline Crew uses your camera to photograph the debris you collected at a cleanup.',
        photosPermission: false,
        microphonePermission: false,
      },
    ],
    [
      'expo-notifications',
      {
        // Local reminders only (Lesson 6.4): no push entitlement
        enableRemoteNotifications: false,
        icon: './assets/images/notification-icon.png',
        color: '#1f6f8b',
      },
    ],
    'expo-sharing',
    // Without a key, maps on Android builds stay empty (Expo Go and iPhones do not need one)
    ['react-native-maps', { androidGoogleMapsApiKey: googleMapsKey }],
    [
      'expo-build-properties',
      {
        // Preview builds are release builds, which refuse plain http. This lets a preview build
        // reach shoreline-api on your computer; production never gets it.
        android: { usesCleartextTraffic: variant === 'preview' },
      },
    ],
  ],
  extra: {
    ...config.extra,
    eas: { projectId: easProject.projectId },
  },
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
