import Constants from 'expo-constants';

// "Starter Dev, version 1.0.0": the name and version app.config.ts gave this build (Lesson 9.1).
// A tester's bug report starts here: which variant, which version.
export function appVersionLine(): string {
  const config = Constants.expoConfig;
  return `${config?.name ?? 'The app'}, version ${config?.version ?? 'unknown'}`;
}
