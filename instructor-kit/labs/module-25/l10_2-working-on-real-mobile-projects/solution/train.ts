// Stretch (Task 3): which release train a change leaves on (Lesson 10.2, "Release trains"). Whatever is
// merged and tested by the cut-off leaves on this train; a JavaScript-only FIX that misses it can go out
// as an EAS Update between trains (same runtime version, preview channel first); native changes wait.
export interface Change {
  title: string;
  /** "2030-04-02": the day it was merged to main */
  mergedOn: string;
  kind: 'feature' | 'fix';
  /** A new native package, a config plugin, a permission or an app.config.ts change */
  native: boolean;
}

export type Departure = 'this train' | 'an update between trains' | 'the next train';

export function departure(change: Change, cutOff: string): Departure {
  if (change.mergedOn <= cutOff) {
    return 'this train'; // "2030-04-02" strings compare in date order
  }
  return change.kind === 'fix' && !change.native ? 'an update between trains' : 'the next train';
}
