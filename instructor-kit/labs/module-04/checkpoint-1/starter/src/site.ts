import type { Site } from './types';

// Part A (Lesson 1.3): the API sends JSON, and JSON is `unknown` until you have checked it.
// Return true only for a value with every field of a Site, each of the right type
// (terrain: one of 'sand', 'rocky', 'mixed', 'marsh').
export function isSite(value: unknown): value is Site {
  throw new Error('TODO A: check the value');
}
