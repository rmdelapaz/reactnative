import type { SymbolViewProps } from 'expo-symbols';

import type { Terrain } from './types';

// Task 2: one icon per kind of beach, named by its job (like Shoreline Crew's Icon table): an SF Symbol for iOS,
// a Material Symbol for Android and the web. Two entries are wrong. Run the tests AND npm run typecheck: each tool
// finds one of them.
export const terrainIcons = {
  sand: { ios: 'beach.umbrella', android: 'beach_access', web: 'beach_access' },
  rocky: 'mountain.2',
  marsh: { ios: 'leaf', android: 'grass', web: 'grass' },
  mixed: { ios: 'square.grid.2x2', android: 'grid_veiw', web: 'grid_view' },
} satisfies Record<Terrain, SymbolViewProps['name']>;
