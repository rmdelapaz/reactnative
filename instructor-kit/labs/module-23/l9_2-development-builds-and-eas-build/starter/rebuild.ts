// Task 3: does a change need a new development build, or is Metro enough?
export type Change =
  | { kind: 'code'; file: string } // a .ts or .tsx file Metro bundles
  | { kind: 'package'; name: string; native: boolean } // npx expo install <name>
  | { kind: 'config'; field: 'name' | 'icon' | 'ios.bundleIdentifier' | 'android.package' | 'plugins' } // app config
  | { kind: 'env'; name: string; build: 'development' | 'preview' }; // a variable, for an installed build

export type Verdict = 'metro' | 'new build';

// JavaScript (and the EXPO_PUBLIC_ values Metro inlines for a development build) travels from Metro: 'metro'.
// Anything compiled into the app or written into the native projects by prebuild: 'new build'.
// Use a switch on change.kind and end with: const unknown: never = change;
export function needsNewBuild(change: Change): Verdict {
  throw new Error(`TODO 3: decide for a "${change.kind}" change`);
}
