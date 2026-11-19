// Tests (do not edit): npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { answerFor, collected, type DataItem, deletionInApp } from './privacy.ts';

// Tidepool Count's inventory, made by reading its code (Lesson 9.4, Step 1)
const inventory: DataItem[] = [
  { data: 'Email address', leavesPhone: true, kept: true, linkedToAccount: true },
  { data: 'Sea star counts', leavesPhone: true, kept: true, linkedToAccount: true },
  { data: 'Location (the distance to the pool, worked out on the phone)', leavesPhone: false, kept: false, linkedToAccount: false },
  { data: 'Crash reports (a service, without the account)', leavesPhone: true, kept: true, linkedToAccount: false },
  { data: 'Tide-table lookup (answered and forgotten)', leavesPhone: true, kept: false, linkedToAccount: false },
];

test('Task 2: what is processed only on the phone is not collected', () => {
  assert.equal(answerFor(inventory[2]!), 'not collected');
});

test('Task 2: the form lists exactly what leaves the phone and is kept', () => {
  assert.deepEqual(collected(inventory), ['Email address', 'Sea star counts', 'Crash reports (a service, without the account)']);
  assert.equal(answerFor(inventory[3]!), 'collected, not linked to the user');
});

test('Task 2: an app that creates accounts must offer deletion inside the app', () => {
  assert.equal(deletionInApp({ createsAccounts: true }), true);
  assert.equal(deletionInApp({ createsAccounts: false }), false);
});
