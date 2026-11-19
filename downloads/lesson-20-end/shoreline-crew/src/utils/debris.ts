// The API's debris categories and the app's words for them (copied from the HQ's utils/debris.ts,
// in this project's style). GET /api/meta lists the same ones.
import type { DebrisCategory } from '@/api/types';

/** Every category, in the API's order */
export const debrisCategories: DebrisCategory[] = [
  'plastic-bottles',
  'plastic-bags',
  'food-wrappers',
  'bottle-caps',
  'cigarette-butts',
  'fishing-gear',
  'glass',
  'metal',
  'foam',
  'other',
];

/** What the app calls each category */
export const debrisLabels: Record<DebrisCategory, string> = {
  'plastic-bottles': 'Plastic bottles',
  'plastic-bags': 'Plastic bags',
  'food-wrappers': 'Food wrappers',
  'bottle-caps': 'Bottle caps',
  'cigarette-butts': 'Cigarette butts',
  'fishing-gear': 'Fishing line and nets',
  glass: 'Glass',
  metal: 'Metal and cans',
  foam: 'Foam pieces',
  other: 'Other',
};
