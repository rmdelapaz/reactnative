// Tests (do not edit): npm test
import type { ConfigContext, ExpoConfig } from 'expo/config';

// The settings app.config.ts reads, cleared before every config so nothing leaks in from your terminal
const settings = ['APP_VARIANT', 'EXPO_PUBLIC_API_URL', 'ANDROID_GOOGLE_MAPS_API_KEY'];

function configFor(env: Record<string, string>): ExpoConfig {
  const saved = { ...process.env };
  for (const name of settings) delete process.env[name];
  Object.assign(process.env, env);
  try {
    let config: ExpoConfig | undefined;
    jest.isolateModules(() => {
      // app.config.ts reads process.env when it loads, so load a fresh copy for every config
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { default: makeConfig } = require('../app.config') as {
        default: (context: ConfigContext) => ExpoConfig;
      };
      config = makeConfig({ config: {} } as ConfigContext);
    });
    if (!config) throw new Error('app.config.ts returned nothing');
    return config;
  } finally {
    process.env = saved;
  }
}

function mapsKey(config: ExpoConfig): unknown {
  const entry = config.plugins?.find((plugin) => Array.isArray(plugin) && plugin[0] === 'react-native-maps');
  return Array.isArray(entry) ? entry[1]?.androidGoogleMapsApiKey : 'no react-native-maps entry';
}

test('Task 1: development by default: Lookout Dev, with the .dev id on both platforms', () => {
  const config = configFor({});
  expect(config.name).toBe('Lookout Dev');
  expect(config.ios?.bundleIdentifier).toBe('com.example.shorelinelookout.dev');
  expect(config.android?.package).toBe('com.example.shorelinelookout.dev');
});

test('Task 1: APP_VARIANT=preview gives Lookout Preview and the .preview id', () => {
  const config = configFor({ APP_VARIANT: 'preview' });
  expect(config.name).toBe('Lookout Preview');
  expect(config.android?.package).toBe('com.example.shorelinelookout.preview');
});

test('Task 1: a misspelled variant stops with a message that names it', () => {
  expect(() => configFor({ APP_VARIANT: 'Preview' })).toThrow(
    'APP_VARIANT must be development, preview or production, not "Preview".',
  );
});

test('Task 2: production refuses plain http and accepts https', () => {
  expect(() =>
    configFor({ APP_VARIANT: 'production', EXPO_PUBLIC_API_URL: 'http://lookout-api.example.org' }),
  ).toThrow('A production build needs an https:// EXPO_PUBLIC_API_URL, not "http://lookout-api.example.org".');
  const config = configFor({ APP_VARIANT: 'production', EXPO_PUBLIC_API_URL: 'https://lookout-api.example.org' });
  expect(config.name).toBe('Shoreline Lookout');
  expect(config.ios?.bundleIdentifier).toBe('com.example.shorelinelookout');
});

test('Task 2: only development gets its own link scheme', () => {
  expect(configFor({}).scheme).toBe('shorelinelookout-dev');
  expect(configFor({ APP_VARIANT: 'preview' }).scheme).toBe('shorelinelookout');
});

test('Task 3: the Maps key comes from ANDROID_GOOGLE_MAPS_API_KEY, never from the file', () => {
  expect(mapsKey(configFor({ ANDROID_GOOGLE_MAPS_API_KEY: 'key-from-env-local' }))).toBe('key-from-env-local');
  expect(mapsKey(configFor({}))).toBeUndefined();
});
