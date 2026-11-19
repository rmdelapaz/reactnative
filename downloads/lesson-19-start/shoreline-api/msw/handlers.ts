// MSW 3 handlers that answer exactly like the Shoreline Crew API, for tests (Vitest) and the browser.
// They run the API's own code (core/api.ts) on a fresh copy of the sample data, so a test sees the same
// ids, rules, errors and pagination headers as the real server, with no server running.
//
//   import { setupServer } from 'msw/node'
//   import { createHandlers } from './mocks/msw/handlers.ts'
//   const { handlers, api } = createHandlers({ today: '2026-06-01' })
//   const server = setupServer(...handlers)
//   beforeEach(() => api.reset())          // every test starts from the sample data
//
// Override one answer in a test with server.use(http.get(`${API_URL}/api/events`, () => ...)).
import { http } from 'msw'
import { createApi, type ApiOptions } from '../core/api.ts'

/** Where the apps expect the API in development (VITE_API_URL in .env.local). */
export const API_URL = 'http://localhost:4000'

export function createHandlers(options: ApiOptions & { baseUrl?: string } = {}) {
  const { baseUrl = API_URL, ...apiOptions } = options
  const api = createApi(apiOptions)
  const handlers = [
    http.all(`${baseUrl}/api`, ({ request }) => api.handle(request)),
    http.all(`${baseUrl}/api/*`, ({ request }) => api.handle(request)),
  ]
  return { handlers, api }
}
