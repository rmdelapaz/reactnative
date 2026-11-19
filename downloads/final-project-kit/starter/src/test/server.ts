// The tests' server (Lesson 8.2): MSW answers every request to API_URL with the app's own mock API
// (src/mock-api/handle.ts). The screens go through the client's real fetch path, and the rules are
// the same ones demo mode uses: one set of rules, tested once, used everywhere.
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { resetDb } from '@/mock-api/db';
import { handle } from '@/mock-api/handle';

/** The address jest.setup.ts gives the app */
export const API_URL = 'http://localhost:4000';

const mockApi = http.all(`${API_URL}/api/*`, async ({ request }) => {
  const url = new URL(request.url);
  const body: unknown =
    request.method === 'GET' ? undefined : await request.json().catch(() => undefined);
  const answer = handle({
    method: request.method,
    path: url.pathname.replace(/^\/api/, '') + url.search,
    body,
  });
  return new HttpResponse(JSON.stringify(answer.body), {
    status: answer.status,
    headers: { 'Content-Type': 'application/json' },
  });
});

export const server = setupServer(mockApi);

/**
 * Answer this test file's requests with the mock API: call it once at the top of a test file that
 * talks to the API. A request nobody answers fails the test.
 */
export function startMockApi(): void {
  beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
  // Every test starts from the sample data, with only the mock API's handler
  beforeEach(() => resetDb());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}
