import type { SymbolViewProps } from 'expo-symbols';

import type { Terrain } from './types';

// One icon per kind of beach, named by its job. Every entry has all three names: a plain SF Symbol name
// type-checks but draws nothing on Android or in the web preview. tsc checks both name sets.
export const terrainIcons = {
  sand: { ios: 'beach.umbrella', android: 'beach_access', web: 'beach_access' },
  rocky: { ios: 'mountain.2', android: 'landscape', web: 'landscape' },
  marsh: { ios: 'leaf', android: 'grass', web: 'grass' },
  mixed: { ios: 'square.grid.2x2', android: 'grid_view', web: 'grid_view' },
} satisfies Record<Terrain, SymbolViewProps['name']>;
