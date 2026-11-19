// Task 2: sort `npm outdated` rows the way Lesson 10.2's Step 1 does: pinned (the Expo SDK picks the
// version: `npx expo install`), update (a plain JavaScript package: a branch with CI), or later (a new
// major version: read its release notes first).
export interface OutdatedRow {
  name: string;
  current: string;
  wanted: string;
  latest: string;
}

export type Verdict = 'pinned' | 'update' | 'later';

/** The part of a version that signals breaking changes: the major, or the minor while the major is 0 */
export function breakingPart(version: string): string {
  const [major = '0', minor = '0'] = version.split('.');
  return major === '0' ? `0.${minor}` : major;
}

export function classify(row: OutdatedRow, sdk: Record<string, string>): Verdict {
  throw new Error(`TODO 2: pinned, update or later for ${row.name} ${row.current} -> ${row.latest}?`);
}

/** Every row's verdict, in the order npm printed them: "react-native-gesture-handler: pinned" */
export function report(rows: readonly OutdatedRow[], sdk: Record<string, string>): string[] {
  throw new Error(`TODO 2: a report of ${rows.length} rows`);
}
