// Task 3, stretch (do not edit): npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { departure } from './train.ts';

const cutOff = '2030-04-10';

test('Task 3: merged by the cut-off, it leaves on this train', () => {
  assert.equal(departure({ title: 'Photo at check-in', mergedOn: '2030-04-09', kind: 'feature', native: true }, cutOff), 'this train');
});

test('Task 3: a JavaScript-only fix after the cut-off can go as an update', () => {
  assert.equal(departure({ title: 'Typo on the map screen', mergedOn: '2030-04-12', kind: 'fix', native: false }, cutOff),
    'an update between trains');
});

test('Task 3: a late native change or feature waits for the next train', () => {
  assert.equal(departure({ title: 'New permission sentence', mergedOn: '2030-04-12', kind: 'fix', native: true }, cutOff), 'the next train');
  assert.equal(departure({ title: 'Dark map style', mergedOn: '2030-04-11', kind: 'feature', native: false }, cutOff), 'the next train');
});
