// Task 1: read the API's address out of the text of a .env.local file, and say what is wrong with it
// in words a teammate can act on. Plain TypeScript: no React Native, no fetch.
export type EnvResult = { address: string } | { problem: string };

const name = 'EXPO_PUBLIC_API_URL';

/** The address in a .env.local text (comments and blank lines ignored), or what to fix */
export function readApiAddress(envText: string): EnvResult {
  // TODO 1: find the EXPO_PUBLIC_API_URL line(s) and check them (TASKS.md lists the five problems, in order)
  throw new Error(`TODO 1: read ${name} from ${JSON.stringify(envText.slice(0, 20))}…`);
}
