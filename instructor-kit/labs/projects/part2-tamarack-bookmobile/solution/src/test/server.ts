// The mock API for tests (GIVEN): the Bookmobile API's own code answers the app's requests inside
// the test run. src/mocks/ is bookmobile-api's code, copied unchanged (tsconfig.json and the
// linter leave that folder out); this require() says what the one function we call looks like.
import type { RequestHandler } from 'msw';
import { setupServer } from 'msw/node';

type MockApi = { reset(): void };

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createHandlers } = require('../mocks/msw/handlers.ts') as {
  createHandlers(options?: { baseUrl?: string }): { handlers: RequestHandler[]; api: MockApi };
};

/** The address jest.setup.ts gives the app */
export const API_URL = 'http://localhost:4100';

export const { handlers, api } = createHandlers({ baseUrl: API_URL });
export const server = setupServer(...handlers);

/** Call once at the top of a test file that talks to the API. A request it does not know fails the test. */
export function startMockApi(): void {
  beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
  beforeEach(() => api.reset());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}
