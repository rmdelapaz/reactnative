// The mock API for tests: shoreline-api's own code answers the app's requests inside the test run
// (the HQ's src/test/server.ts, with one difference: how it loads the handlers)
import type { RequestHandler } from 'msw';
import { setupServer } from 'msw/node';

/** The part of shoreline-api's createApi() the tests use: reset() puts the sample data back */
type MockApi = { reset(): void };

// src/mocks/ is shoreline-api's code, copied unchanged. Two of its lines do not type-check
// against React Native's global types, so tsconfig.json leaves that folder out, and this
// require() says what the one function we call looks like
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createHandlers } = require('../mocks/msw/handlers.ts') as {
  createHandlers(options?: { baseUrl?: string }): { handlers: RequestHandler[]; api: MockApi };
};

/** The address jest.setup.ts gives the app */
export const API_URL = 'http://localhost:4000';

export const { handlers, api } = createHandlers({ baseUrl: API_URL });
export const server = setupServer(...handlers);

/** Every request the app sends from now on, written as 'POST /api/events/e17/logs' */
export function recordRequests(): string[] {
  const requests: string[] = [];
  server.events.on('request:start', ({ request }) => {
    requests.push(`${request.method} ${new URL(request.url).pathname}`);
  });
  return requests;
}

/**
 * Answer this test file's requests with the mock API: call it once at the top of a test file
 * that talks to shoreline-api. A request the mock API does not know fails the test.
 */
export function startMockApi(): void {
  beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
  // Every test starts from the sample data, with only the API's own handlers
  beforeEach(() => api.reset());
  afterEach(() => {
    server.resetHandlers();
    server.events.removeAllListeners();
  });
  afterAll(() => server.close());
}
