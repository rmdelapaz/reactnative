// Tests (do not edit): npm test
import { delay, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import health from '../fixtures/health.json';
import { directionsFor, lanProblem } from './devices';
import { readApiAddress } from './env';
import { checkHealth } from './health';

// MSW plays three computers: one that answers (a real /api/health answer, saved in fixtures/), one that
// refuses at once, and one that never answers (a wrong address on Wi-Fi)
const server = setupServer(
  http.get('http://192.168.1.42:4000/api/health', () => HttpResponse.json(health)),
  http.get('http://localhost:4000/api/health', () => HttpResponse.error()),
  http.get('http://10.0.2.2:4000/api/health', async () => {
    await delay('infinite');
    return HttpResponse.json(health);
  }),
  http.get('http://192.168.1.50:4000/api/health', () => HttpResponse.json({ error: 'not_found' }, { status: 404 })),
);
// MSW 3 calls the option onUnhandledFrame. A request no handler answers fails the test it came from.
const unhandled: string[] = [];
beforeAll(() =>
  server.listen({
    onUnhandledFrame({ frame, defaults }) {
      const { data } = frame; // unknown: narrow it before reading the request
      const request =
        typeof data === 'object' && data !== null && 'request' in data && data.request instanceof Request
          ? data.request
          : undefined;
      unhandled.push(request ? `${request.method} ${request.url}` : frame.protocol);
      defaults.error();
    },
  }),
);
afterEach(() => {
  const missed = unhandled.splice(0);
  if (missed.length) throw new Error(`No MSW handler for: ${missed.join(', ')}`);
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Task 1: a correct .env.local gives the address, without a trailing slash', () => {
  const env = '# Where the app finds shoreline-api\nEXPO_PUBLIC_API_URL=http://192.168.1.42:4000/\n';
  expect(readApiAddress(env)).toEqual({ address: 'http://192.168.1.42:4000' });
});

test('Task 1: the five problems, each in words a teammate can act on', () => {
  expect(readApiAddress('# nothing here yet\n')).toEqual({
    problem: 'EXPO_PUBLIC_API_URL is missing: copy .env.example to .env.local, then restart Metro with --clear.',
  });
  expect(readApiAddress('EXPO_PUBLIC_API_URL=http://localhost:4000\nEXPO_PUBLIC_API_URL=http://192.168.1.42:4000')).toEqual({
    problem: 'EXPO_PUBLIC_API_URL is set 2 times: keep one line.',
  });
  expect(readApiAddress('EXPO_PUBLIC_API_URL = http://192.168.1.42:4000')).toEqual({
    problem: 'Write EXPO_PUBLIC_API_URL=… with no spaces around the =.',
  });
  expect(readApiAddress('EXPO_PUBLIC_API_URL=192.168.1.42:4000')).toEqual({
    problem: '"192.168.1.42:4000" needs http:// at the start, as in http://192.168.1.42:4000.',
  });
  expect(readApiAddress('EXPO_PUBLIC_API_URL=http://192.168.1.42:4000/api')).toEqual({
    problem: '"http://192.168.1.42:4000/api": leave out the /api at the end (the app adds it).',
  });
});

test('Task 2: the address and the API command for each kind of device', () => {
  expect(directionsFor('web-preview', '192.168.1.42')).toEqual({ address: 'http://localhost:4000', startApi: 'node server.ts' });
  expect(directionsFor('ios-simulator', '192.168.1.42')).toEqual({ address: 'http://localhost:4000', startApi: 'node server.ts' });
  expect(directionsFor('android-emulator', '192.168.1.42')).toEqual({ address: 'http://10.0.2.2:4000', startApi: 'node server.ts' });
  expect(directionsFor('phone', '192.168.1.42')).toEqual({ address: 'http://192.168.1.42:4000', startApi: 'node server.ts --host' });
});

test("Task 2: addresses a phone cannot use for your computer", () => {
  expect(lanProblem('192.168.1.42')).toBeNull();
  expect(lanProblem('10.0.0.7')).toBeNull();
  expect(lanProblem('')).toBe("No address yet: read it under Metro's QR code (exp://ADDRESS:8081).");
  expect(lanProblem('127.0.0.1')).toBe("127.0.0.1 is the phone itself on a phone: use your computer's network address.");
  expect(lanProblem('172.24.80.5')).toBe(
    "172.24.80.5 looks like WSL's private address: a phone cannot reach it (Lesson 5.1, Windows and WSL).",
  );
});

test('Task 3: a computer that answers', async () => {
  expect(await checkHealth('http://192.168.1.42:4000')).toEqual({ kind: 'connected', today: health.today });
});

test('Task 3: a refusal and a 404 name the address', async () => {
  expect(await checkHealth('http://localhost:4000')).toEqual({
    kind: 'failed',
    message: 'Could not reach the server at http://localhost:4000.',
  });
  expect(await checkHealth('http://192.168.1.50:4000')).toEqual({
    kind: 'failed',
    message: 'The server at http://192.168.1.50:4000 answered 404.',
  });
});

test('Task 3: an address nobody answers gives up after the time limit', async () => {
  expect(await checkHealth('http://10.0.2.2:4000', 200)).toEqual({
    kind: 'failed',
    message: 'No answer from http://10.0.2.2:4000 within 200 ms.',
  });
});
