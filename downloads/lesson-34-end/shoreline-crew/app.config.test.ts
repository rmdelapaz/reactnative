import type { ConfigContext, ExpoConfig } from 'expo/config';

import easJson from './eas.json';

// Each build profile in eas.json must make the app config produce the right app (Lesson 9.2).
// The test reads the config the way EAS does: only the profile's env, no .env.local.
const settings = ['APP_VARIANT', 'EXPO_PUBLIC_API_URL', 'ANDROID_GOOGLE_MAPS_API_KEY'];

function configFor(env: Record<string, string>): ExpoConfig {
  const saved = { ...process.env };
  for (const name of settings) delete process.env[name];
  Object.assign(process.env, env);
  try {
    let config: ExpoConfig | undefined;
    jest.isolateModules(() => {
      // app.config.ts reads process.env when it loads, so load a fresh copy for every profile
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { default: makeConfig } = require('./app.config') as {
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

it('builds Shoreline Dev from the development profile', () => {
  const config = configFor(easJson.build.development.env);
  expect(config.name).toBe('Shoreline Dev');
  expect(config.android?.package).toBe('com.example.shorelinecrew.dev');
});

it('builds Shoreline Preview from the preview profile, with an API address', () => {
  const { env } = easJson.build.preview;
  const config = configFor(env);
  expect(config.name).toBe('Shoreline Preview');
  expect(config.ios?.bundleIdentifier).toBe('com.example.shorelinecrew.preview');
  expect(env.EXPO_PUBLIC_API_URL).toMatch(/^https?:\/\//);
});

it('refuses the production profile until it has an https API address', () => {
  expect(() => configFor(easJson.build.production.env)).toThrow(
    'A production build needs an https:// EXPO_PUBLIC_API_URL',
  );
  const config = configFor({
    ...easJson.build.production.env,
    EXPO_PUBLIC_API_URL: 'https://crew-api.example.org',
  });
  expect(config.android?.package).toBe('com.example.shorelinecrew');
});

it('gives each release profile its own update channel (Lesson 9.3)', () => {
  // An update sent to "preview" must never reach the volunteers' store app
  expect(easJson.build.preview.channel).toBe('preview');
  expect(easJson.build.production.channel).toBe('production');
});
