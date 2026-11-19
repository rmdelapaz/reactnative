// The app config (Lesson 9.1): names, ids, icons, splash and the native settings of every build.
// Expo runs this file each time it needs the config (npx expo start, export, EAS Build), so it can
// pick values for a variant and read the environment. Change every "Starter" and "com.example"
// to your own before your first build: app ids are permanent once a store has seen them (Lesson 9.4).
import type { ConfigContext, ExpoConfig } from 'expo/config';

// One project, three apps that can sit side by side on a phone, each with its own name and id
const variants = {
  development: { name: 'Starter Dev', appId: 'com.example.starter.dev' },
  preview: { name: 'Starter Preview', appId: 'com.example.starter.preview' },
  production: { name: 'Starter', appId: 'com.example.starter' },
};
type Variant = keyof typeof variants;

function isVariant(value: string): value is Variant {
  return Object.hasOwn(variants, value);
}

// APP_VARIANT picks the variant: set it in the shell, or per build profile in eas.json (Lesson 9.2)
const variant = process.env.APP_VARIANT ?? 'development';
if (!isVariant(variant)) {
  throw new Error(`APP_VARIANT must be development, preview or production, not "${variant}".`);
}

// Where the data comes from (src/api/source.ts). A store build needs a real server over https:
// not the mock API (its data would be fake), and not plain http (release builds block it).
const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? '';
if (variant === 'production' && !apiUrl.startsWith('https://')) {
  throw new Error(`A production build needs an https:// EXPO_PUBLIC_API_URL, not "${apiUrl}".`);
}

// Your project on expo.dev (Lesson 9.2): `npx eas-cli@latest init` prints both values but cannot
// write them into a dynamic config, so paste them here. They name the project; they are not secrets.
const easProject: { owner?: string; projectId?: string } = {};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: variants[variant].name,
  slug: 'starter',
  owner: easProject.owner,
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'starter',
  userInterfaceStyle: 'automatic',
  ios: {
    bundleIdentifier: variants[variant].appId,
    icon: './assets/expo.icon',
    // The App Store asks every build about encryption (Lesson 9.4). The starter only uses what
    // the phone provides (https, the Keychain): exempt. Read the question again for your own app.
    config: { usesNonExemptEncryption: false },
  },
  android: {
    package: variants[variant].appId,
    // "Draw over other apps" is for development tools only: a store build leaves it out (Lesson 9.4)
    blockedPermissions:
      variant === 'production' ? ['android.permission.SYSTEM_ALERT_WINDOW'] : [],
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
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
        backgroundColor: '#208AEF',
        image: './assets/images/splash-icon.png',
        imageWidth: 76,
      },
    ],
    // `npx expo install` cannot write plugins into this file (it is code, not JSON): when it says
    // "Cannot automatically write to dynamic config", add the plugin and its options here by hand
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
