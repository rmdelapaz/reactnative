// A mock API for the lab's tests: MSW answers GET /api/sites with the course API's real answer
// (fixtures/sites.json). A request no handler answers fails the test it came from.
import { delay, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import sites from '../../fixtures/sites.json';

export const API_URL = 'http://api.test';
// The answer takes a moment, as on one bar of signal: long enough to see the loading face
export const server = setupServer(
  http.get(`${API_URL}/api/sites`, async () => {
    await delay(50);
    return HttpResponse.json(sites);
  }),
);

/** Call once at the top of a test file that sends requests */
export function startMockApi(): void {
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
    server.resetHandlers();
    const missed = unhandled.splice(0);
    if (missed.length) throw new Error(`No MSW handler for: ${missed.join(', ')}`);
  });
  afterAll(() => server.close());
}
