import type { BuildProfile, EasJson } from './eas.ts';

// Task 1: the profile `name` with everything it inherits through "extends" (the child's keys win; env, ios and
// android merged key by key), without the extends key.
// Unknown name: throw new Error(`No build profile named "${name}" in eas.json`)
// A circle:     throw new Error(`Build profiles extend each other in a loop: a -> b -> a`)
export function resolveProfile(eas: EasJson, name: string): BuildProfile {
  throw new Error(`TODO 1: resolve the "${name}" profile of ${Object.keys(eas.build).length} (follow extends)`);
}
