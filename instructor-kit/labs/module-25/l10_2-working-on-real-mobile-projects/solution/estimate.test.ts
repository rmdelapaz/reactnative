// Task 1 (do not edit): npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { forgotten, type Part, sayRange, threePoint, total } from './estimate.ts';

// Lesson 10.2's example: a photo at check-in (example hours, for illustration)
const photo: Part[] = [
  { kind: 'happy path', what: 'Check-in modal: button, preview, permission path', optimistic: 2, likely: 3, pessimistic: 6 },
  { kind: 'happy path', what: 'Sending: client function, mutation, error states', optimistic: 1, likely: 2, pessimistic: 4 },
  { kind: 'tests', what: 'Tests: rule and screen', optimistic: 1, likely: 2, pessimistic: 3 },
  { kind: 'two platforms', what: 'Two phones, large text, dark mode', optimistic: 1, likely: 2, pessimistic: 4 },
  { kind: 'privacy and stores', what: 'Privacy inventory and store answers', optimistic: 0.5, likely: 1, pessimistic: 2 },
];

test('Task 1: the three-point estimate of one part', () => {
  assert.equal(threePoint({ optimistic: 2, likely: 3, pessimistic: 6 }), 3.3333333333333335);
});

test("Task 1: the lesson's total: 5.5, 10 and 19 hours, about 11", () => {
  assert.deepEqual(total(photo), { optimistic: 5.5, likely: 10, pessimistic: 19, threePoint: 10.75 });
});

test('Task 1: the checklist names the work nobody estimated yet', () => {
  assert.deepEqual(forgotten(photo), ['server', 'permissions', 'offline', 'shipping']);
  assert.equal(forgotten([]).length, 8);
});

test('Task 1: a range and its assumptions, not one number', () => {
  assert.equal(sayRange(photo, ['the server accepts photos']),
    'About 11 hours, between 5.5 and 19, once the server accepts photos.');
  assert.equal(sayRange(photo.slice(0, 1), []), 'About 3 hours, between 2 and 6.');
});
