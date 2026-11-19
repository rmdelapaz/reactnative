import type { EasJson } from './eas.ts';

export interface ProfileReport {
  problems: string[];
  notes: string[];
}

// Task 2: one problem line per mistake, as "<profile>: <what is wrong>" (TASKS.md lists the three checks), and a
// note (not a problem) for the production guard while there is no https server.
export function checkProfiles(eas: EasJson): ProfileReport {
  throw new Error(`TODO 2: check ${Object.keys(eas.build).length} build profiles`);
}
