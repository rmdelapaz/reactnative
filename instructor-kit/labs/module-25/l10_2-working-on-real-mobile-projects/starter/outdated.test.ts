// Task 2 (do not edit): npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { breakingPart, classify, report } from './outdated.ts';
import { sdk58, shorelineOutdated } from './shoreline-outdated.ts';

test('Task 2: the breaking part of a version', () => {
  assert.equal(breakingPart('19.3.0'), '19');
  assert.equal(breakingPart('0.13.5'), '0.13');
});

test("Task 2: the lesson's npm outdated card, sorted", () => {
  assert.deepEqual(report(shorelineOutdated, sdk58), [
    '@lottiefiles/dotlottie-react: later',
    '@react-native-async-storage/async-storage: pinned',
    '@shopify/flash-list: pinned',
    'eslint: later',
    'react: pinned',
    'react-dom: pinned',
    'react-native-gesture-handler: pinned',
    'react-native-worklets: pinned',
    'typescript: later',
  ]);
});

test('Task 2: a plain JavaScript package with a new minor version is worth an update', () => {
  // an example row, not real output
  assert.equal(classify({ name: 'zod', current: '4.6.7', wanted: '4.6.7', latest: '4.7.0' }, sdk58), 'update');
});
