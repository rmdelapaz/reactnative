// Task 3: does a change need a new development build, or is Metro enough?
export type Change =
  | { kind: 'code'; file: string } // a .ts or .tsx file Metro bundles
  | { kind: 'package'; name: string; native: boolean } // npx expo install <name>
  | { kind: 'config'; field: 'name' | 'icon' | 'ios.bundleIdentifier' | 'android.package' | 'plugins' } // app config
  | { kind: 'env'; name: string; build: 'development' | 'preview' }; // a variable, for an installed build

export type Verdict = 'metro' | 'new build';

// JavaScript (and the EXPO_PUBLIC_ values Metro inlines for a development build) travels from Metro: 'metro'.
// Anything compiled into the app or written into the native projects by prebuild: 'new build'.
export function needsNewBuild(change: Change): Verdict {
  switch (change.kind) {
    case 'code':
      return 'metro';
    case 'package':
      return change.native ? 'new build' : 'metro';
    case 'config':
      return 'new build'; // name, icon, ids and plugin options are written into the native projects
    case 'env':
      // a development build reads EXPO_PUBLIC_ values from Metro (restart it with --clear); a preview build has
      // them baked in, and other variables are read by config plugins at build time
      return change.build === 'development' && change.name.startsWith('EXPO_PUBLIC_') ? 'metro' : 'new build';
    default: {
      const unknown: never = change;
      throw new Error(`Unknown change: ${JSON.stringify(unknown)}`);
    }
  }
}
