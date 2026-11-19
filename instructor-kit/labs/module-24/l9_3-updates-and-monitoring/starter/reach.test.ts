// Tests (do not edit): npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { type Build, whoGetsIt } from './reach.ts';

// The phones Shoreline Crew's testers and volunteers carry (made-up runtime versions, shortened)
const phones: Build[] = [
  { name: 'Shoreline Dev', channel: null, runtimeVersion: '29268b22', canUpdate: false },
  { name: 'Shoreline Preview (Lesson 9.2)', channel: null, runtimeVersion: '0d4c9e17', canUpdate: false },
  { name: 'Shoreline Preview (old location sentence)', channel: 'preview', runtimeVersion: 'ec08d9b0', canUpdate: true },
  { name: 'Shoreline Preview (current)', channel: 'preview', runtimeVersion: '142af542', canUpdate: true },
  { name: 'Shoreline Crew', channel: 'production', runtimeVersion: '5b7e01c3', canUpdate: true },
];

test('Task 1: a JavaScript fix for preview reaches only the preview build it was made for', () => {
  const fix = { channel: 'preview', runtimeVersion: '142af542', message: 'New tagline' };
  assert.deepEqual(whoGetsIt(phones, fix), ['Shoreline Preview (current)']);
});

test('Task 1: an update published without APP_VARIANT reaches nobody', () => {
  const devLabel = { channel: 'preview', runtimeVersion: '29268b22', message: 'New tagline' };
  assert.deepEqual(whoGetsIt(phones, devLabel), []);
});

test('Task 1: an update for the store app never reaches a tester', () => {
  const store = { channel: 'production', runtimeVersion: '5b7e01c3', message: 'Friendlier empty logbook' };
  assert.deepEqual(whoGetsIt(phones, store), ['Shoreline Crew']);
});
