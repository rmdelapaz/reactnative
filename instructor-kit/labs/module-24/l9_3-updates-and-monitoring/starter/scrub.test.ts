// Tests (do not edit): npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { type Reporter, scrub, scrubbing } from './scrub.ts';

test('Task 2: an email address never leaves the phone', () => {
  assert.equal(scrub('Sign-in failed for theo.nakamura@example.org'), 'Sign-in failed for [email]');
});

test('Task 2: neither does a sign-in key, even inside an address', () => {
  assert.equal(
    scrub('401 with Bearer dev-volunteer at /api/me?email=ana.reyes@example.org'),
    '401 with Bearer [key] at /api/me?email=[email]',
  );
  assert.equal(scrub('Could not reach the server'), 'Could not reach the server');
});

test('Task 2: the reporter sends a scrubbed copy and keeps the original', () => {
  const sent: [Error, string][] = [];
  const send: Reporter = (error, where) => sent.push([error, where]);
  const original = new TypeError('No log for ana.reyes@example.org');
  scrubbing(send)(original, 'sync');
  assert.equal(sent.length, 1);
  assert.equal(sent[0]?.[0].message, 'No log for [email]');
  assert.equal(sent[0]?.[0].name, 'TypeError');
  assert.equal(sent[0]?.[1], 'sync');
  assert.equal(original.message, 'No log for ana.reyes@example.org');
});
