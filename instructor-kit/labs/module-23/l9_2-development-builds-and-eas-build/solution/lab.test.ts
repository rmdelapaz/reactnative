// Tests (do not edit): npm test
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { checkProfiles } from './checkProfiles.ts';
import { parseEasJson, type EasJson } from './eas.ts';
import { resolveProfile } from './profiles.ts';
import { needsNewBuild } from './rebuild.ts';

const eas: EasJson = {
  build: {
    development: { developmentClient: true, distribution: 'internal', env: { APP_VARIANT: 'development' } },
    'development-simulator': { extends: 'development', ios: { simulator: true } },
    preview: {
      distribution: 'internal',
      env: { APP_VARIANT: 'preview', EXPO_PUBLIC_API_URL: 'http://192.168.1.42:4000' },
    },
    'preview-staging': { extends: 'preview', env: { EXPO_PUBLIC_API_URL: 'https://staging.example.org' } },
    production: { autoIncrement: true, env: { APP_VARIANT: 'production' } },
  },
};

test('Task 1: extends brings the parent along, and the child adds its own keys', () => {
  assert.deepEqual(resolveProfile(eas, 'development-simulator'), {
    developmentClient: true,
    distribution: 'internal',
    env: { APP_VARIANT: 'development' },
    ios: { simulator: true },
  });
  assert.deepEqual(resolveProfile(eas, 'preview-staging').env, {
    APP_VARIANT: 'preview',
    EXPO_PUBLIC_API_URL: 'https://staging.example.org',
  });
});

test('Task 1: a profile that is not there', () => {
  assert.throws(() => resolveProfile(eas, 'staging'), { message: 'No build profile named "staging" in eas.json' });
});

test('Task 1: profiles that extend each other in a circle', () => {
  const circle: EasJson = { build: { a: { extends: 'b' }, b: { extends: 'a' } } };
  assert.throws(() => resolveProfile(circle, 'a'), {
    message: 'Build profiles extend each other in a loop: a -> b -> a',
  });
});

test('Task 2: a good eas.json has no problems, and production waits for https', () => {
  assert.deepEqual(checkProfiles(eas), {
    problems: [],
    notes: ['production: refused until the API has an https:// address'],
  });
});

test('Task 2: a misspelled variant is reported with the config\'s own message', () => {
  const typo: EasJson = { build: { preview: { ...eas.build.preview, env: { APP_VARIANT: 'prevue', EXPO_PUBLIC_API_URL: 'http://192.168.1.42:4000' } } } };
  assert.deepEqual(checkProfiles(typo).problems, [
    'preview: APP_VARIANT must be development, preview or production, not "prevue".',
  ]);
});

test('Task 2: a build with its JavaScript inside needs an address, a dev client does not', () => {
  const missing: EasJson = {
    build: {
      preview: { distribution: 'internal', env: { APP_VARIANT: 'preview' } },
      development: { developmentClient: true, distribution: 'internal' },
    },
  };
  assert.deepEqual(checkProfiles(missing).problems, [
    'preview: a build with its JavaScript inside needs EXPO_PUBLIC_API_URL in its env (.env.local never reaches a cloud build)',
    'development: its env sets no APP_VARIANT, so it would build the development app',
  ]);
});

test('Task 2: the lab\'s own eas.json has no problems', () => {
  const own = parseEasJson(readFileSync(new URL('./eas.json', import.meta.url), 'utf8'));
  assert.deepEqual(checkProfiles(own).problems, []);
});

test('Task 3: JavaScript travels from Metro', () => {
  assert.equal(needsNewBuild({ kind: 'code', file: 'src/app/index.tsx' }), 'metro');
  assert.equal(needsNewBuild({ kind: 'package', name: 'zod', native: false }), 'metro');
  assert.equal(needsNewBuild({ kind: 'env', name: 'EXPO_PUBLIC_API_URL', build: 'development' }), 'metro');
});

test('Task 3: native changes need a new build', () => {
  assert.equal(needsNewBuild({ kind: 'package', name: 'expo-camera', native: true }), 'new build');
  assert.equal(needsNewBuild({ kind: 'config', field: 'plugins' }), 'new build');
  assert.equal(needsNewBuild({ kind: 'env', name: 'EXPO_PUBLIC_API_URL', build: 'preview' }), 'new build');
  assert.equal(needsNewBuild({ kind: 'env', name: 'ANDROID_GOOGLE_MAPS_API_KEY', build: 'development' }), 'new build');
});
