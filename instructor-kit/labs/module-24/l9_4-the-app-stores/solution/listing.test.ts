// Tests (do not edit): npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { type Listing, listingProblems, utf8Bytes } from './listing.ts';

// Tidepool Count: a citizen-science app for counting sea stars at low tide (a made-up client)
const draft: Listing = {
  name: 'Tidepool Count',
  subtitle: 'Sea stars at low tide',
  promotionalText: 'This month: the anemone survey at North Jetty.',
  keywords: 'tidepool,sea star,anemone,citizen science,survey,beach,low tide',
  shortDescription: 'Count sea stars at low tide with your crew, even with no signal.',
  description: 'Tidepool Count helps volunteer crews count what lives in the tide pools.',
};

test('Task 1: a listing within every limit has no problems', () => {
  assert.deepEqual(listingProblems(draft), []);
});

test('Task 1: keywords are counted in bytes', () => {
  assert.equal(utf8Bytes('étoile'), 7);
  assert.deepEqual(listingProblems({ ...draft, keywords: 'tidepool,sea star,étoile de mer,estrella de mar,science citoyenne,marée basse,écologie,anémone,récif' }), [
    'keywords: 105 bytes (App Store Connect allows 100)',
  ]);
});

test("Task 1: Google Play's short description is short", () => {
  assert.deepEqual(listingProblems({ ...draft, shortDescription: 'Count sea stars and anemones at low tide with your crew, even with no signal, and share the totals.' }), [
    'shortDescription: 99 characters (Google Play allows 80)',
  ]);
});
