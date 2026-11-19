// Tests (do not edit): npm test. They read the workflow's run: steps, in order.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const steps = readFileSync(new URL('./.github/workflows/ci.yml', import.meta.url), 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.startsWith('- run: '))
  .map((line) => line.slice('- run: '.length));

test('Task 3: installs exactly what the lockfile says', () => {
  assert.equal(steps[0], 'npm ci');
});

test('Task 3: writes the generated types before the type check', () => {
  const types = steps.indexOf('npx expo customize tsconfig.json');
  assert.ok(types >= 0, 'no step writes expo-env.d.ts and the route types');
  assert.ok(types < steps.indexOf('npx tsc --noEmit'), 'the types must exist before tsc runs');
});

test('Task 3: runs the tests once, then stops', () => {
  assert.equal(steps.at(-1), 'npm test -- --watchAll=false');
});
