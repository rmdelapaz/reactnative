// Task 1: read the API's address out of the text of a .env.local file, and say what is wrong with it
// in words a teammate can act on. Plain TypeScript: no React Native, no fetch.
export type EnvResult = { address: string } | { problem: string };

const name = 'EXPO_PUBLIC_API_URL';

/** The address in a .env.local text (comments and blank lines ignored), or what to fix */
export function readApiAddress(envText: string): EnvResult {
  const lines = envText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'))
    .filter((line) => line.split('=')[0].trim() === name);
  if (lines.length === 0) {
    return { problem: `${name} is missing: copy .env.example to .env.local, then restart Metro with --clear.` };
  }
  if (lines.length > 1) {
    return { problem: `${name} is set ${lines.length} times: keep one line.` };
  }
  const line = lines[0];
  const value = line.slice(line.indexOf('=') + 1);
  if (!line.startsWith(`${name}=`) || value !== value.trimStart()) {
    return { problem: `Write ${name}=… with no spaces around the =.` };
  }
  if (!/^https?:\/\//i.test(value)) {
    return { problem: `"${value}" needs http:// at the start, as in http://192.168.1.42:4000.` };
  }
  if (/\/api\/?$/.test(value)) {
    return { problem: `"${value}": leave out the /api at the end (the app adds it).` };
  }
  return { address: value.replace(/\/+$/, '') };
}
