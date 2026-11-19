import { appFor } from './appConfig.ts';
import type { BuildProfile, EasJson } from './eas.ts';
import { resolveProfile } from './profiles.ts';

export interface ProfileReport {
  problems: string[];
  notes: string[];
}

const NO_HTTPS_YET = 'A production build needs an https://';

// Task 2: one problem line per mistake, as "<profile>: <what is wrong>", and a note (not a problem) for the
// production guard while there is no https server.
export function checkProfiles(eas: EasJson): ProfileReport {
  const problems: string[] = [];
  const notes: string[] = [];
  for (const name of Object.keys(eas.build)) {
    let profile: BuildProfile;
    try {
      profile = resolveProfile(eas, name);
    } catch (error) {
      problems.push(`${name}: ${(error as Error).message}`);
      continue;
    }
    const env = profile.env ?? {};
    if (env.APP_VARIANT === undefined) {
      problems.push(`${name}: its env sets no APP_VARIANT, so it would build the development app`);
    }
    try {
      appFor(env);
    } catch (error) {
      const message = (error as Error).message;
      if (message.startsWith(NO_HTTPS_YET)) notes.push(`${name}: refused until the API has an https:// address`);
      else problems.push(`${name}: ${message}`);
    }
    const javascriptInside =
      profile.distribution === 'internal' && !profile.developmentClient && !profile.ios?.simulator;
    if (javascriptInside && !/^https?:\/\//.test(env.EXPO_PUBLIC_API_URL ?? '')) {
      problems.push(
        `${name}: a build with its JavaScript inside needs EXPO_PUBLIC_API_URL in its env (.env.local never reaches a cloud build)`,
      );
    }
  }
  return { problems, notes };
}
