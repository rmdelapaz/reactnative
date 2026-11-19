// Where the app's data comes from, read once from EXPO_PUBLIC_API_URL (Lesson 5.1):
//   demo                      the mock API inside the app (src/mock-api): no server, any network
//   http://192.168.1.42:4000  a server on your computer (start it so a phone can reach it)
//   https://api.example.com   a real server: the only kind a production build accepts (app.config.ts)
// EXPO_PUBLIC_ values are copied into the JavaScript bundle: never put a secret in one.

export type DataSource = { kind: 'demo' } | { kind: 'server'; baseUrl: string };

/** EXPO_PUBLIC_API_URL is missing or written wrongly: no request can work until it is fixed */
export class SourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SourceError';
  }
}

export function readDataSource(value: string = process.env.EXPO_PUBLIC_API_URL ?? ''): DataSource {
  if (value === '') {
    throw new SourceError(
      'EXPO_PUBLIC_API_URL is not set: copy .env.example to .env.local, then restart Metro.',
    );
  }
  if (value === 'demo') {
    return { kind: 'demo' };
  }
  if (!/^https?:\/\/[^/]/i.test(value)) {
    throw new SourceError(
      `EXPO_PUBLIC_API_URL is "${value}": use demo, or an address that starts with http:// or https://.`,
    );
  }
  if (/\/api\/?$/.test(value)) {
    throw new SourceError(
      `EXPO_PUBLIC_API_URL is "${value}": leave out the /api at the end (the app adds it).`,
    );
  }
  return { kind: 'server', baseUrl: value.replace(/\/+$/, '') }; // a trailing slash would make //api
}
