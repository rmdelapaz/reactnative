import type { BuildProfile, EasJson } from './eas.ts';

// Task 1: the profile `name` with everything it inherits through "extends" (the child's keys win; env, ios and
// android merged key by key), without the extends key.
export function resolveProfile(eas: EasJson, name: string, seen: string[] = []): BuildProfile {
  const profile = eas.build[name];
  if (!profile) throw new Error(`No build profile named "${name}" in eas.json`);
  if (seen.includes(name)) {
    throw new Error(`Build profiles extend each other in a loop: ${[...seen, name].join(' -> ')}`);
  }
  const { extends: parentName, ...own } = profile;
  if (parentName === undefined) return own;

  const parent = resolveProfile(eas, parentName, [...seen, name]);
  const merged: BuildProfile = { ...parent, ...own };
  if (parent.env || own.env) merged.env = { ...parent.env, ...own.env };
  if (parent.ios || own.ios) merged.ios = { ...parent.ios, ...own.ios };
  if (parent.android || own.android) merged.android = { ...parent.android, ...own.android };
  return merged;
}
