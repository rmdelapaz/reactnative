import type { ConfigContext, ExpoConfig } from 'expo/config';

import easJson from './eas.json';

// Each build profile in eas.json must make the app config produce the right app (Lesson 9.2).
// The test reads the config the way EAS does: only the profile's env, no .env.local.
const settings = ['APP_VARIANT', 'EXPO_PUBLIC_API_URL'];

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

it('builds the development app when no variant is set', () => {
  const config = configFor({});
  expect(config.name).toBe('Starter Dev');
  expect(config.android?.package).toBe('com.example.starter.dev');
});

it('builds the preview app from the preview profile, on the mock API', () => {
  const { env } = easJson.build.preview;
  const config = configFor(env);
  expect(config.name).toBe('Starter Preview');
  expect(config.ios?.bundleIdentifier).toBe('com.example.starter.preview');
  // A preview build anyone can install and try, with no server to reach (the launch row)
  expect(env.EXPO_PUBLIC_API_URL).toBe('demo');
});

it('refuses a production build without a real https server', () => {
  expect(() => configFor(easJson.build.production.env)).toThrow(
    'A production build needs an https:// EXPO_PUBLIC_API_URL',
  );
  expect(() => configFor({ ...easJson.build.production.env, EXPO_PUBLIC_API_URL: 'demo' })).toThrow(
    'not "demo"',
  );
  const config = configFor({
    ...easJson.build.production.env,
    EXPO_PUBLIC_API_URL: 'https://api.example.com',
  });
  expect(config.android?.package).toBe('com.example.starter');
  expect(config.android?.blockedPermissions).toEqual(['android.permission.SYSTEM_ALERT_WINDOW']);
});

it('sends store uploads to testers first (Lesson 9.4)', () => {
  expect(easJson.submit.production.android.track).toBe('internal');
});
