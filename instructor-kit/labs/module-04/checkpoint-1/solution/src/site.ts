import type { Site } from './types';

const terrains: readonly string[] = ['sand', 'rocky', 'mixed', 'marsh'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// A type guard: after `if (isSite(json))`, TypeScript treats the value as a Site
export function isSite(value: unknown): value is Site {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.town === 'string' &&
    typeof value.terrain === 'string' &&
    terrains.includes(value.terrain) &&
    typeof value.accessible === 'boolean' &&
    typeof value.parking === 'string'
  );
}
