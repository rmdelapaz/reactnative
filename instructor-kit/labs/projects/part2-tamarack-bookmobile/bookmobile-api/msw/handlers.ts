// MSW 3 handlers that answer exactly like the Bookmobile API, for tests. They run the API's own code
// (core/api.ts) on a fresh copy of the sample data, so a test sees the same ids, rules and errors as
// the real server, with no server running.
//
//   const { handlers, api } = createHandlers({ baseUrl: 'http://localhost:4100' })
//   const server = setupServer(...handlers)
//   beforeEach(() => api.reset())          // every test starts from the sample data
import { http } from 'msw'
import { createApi, type ApiOptions } from '../core/api.ts'

/** Where the app expects the API in development (EXPO_PUBLIC_API_URL in .env.local) */
export const API_URL = 'http://localhost:4100'

export function createHandlers(options: ApiOptions & { baseUrl?: string } = {}) {
  const { baseUrl = API_URL, ...apiOptions } = options
  const api = createApi(apiOptions)
  const handlers = [
    http.all(`${baseUrl}/api`, ({ request }) => api.handle(request)),
    http.all(`${baseUrl}/api/*`, ({ request }) => api.handle(request)),
  ]
  return { handlers, api }
}
