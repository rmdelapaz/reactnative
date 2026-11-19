// The mock API: the starter's stand-in for a server (worksheet section 7). It answers the same
// requests a real API would, with the same status codes and error bodies, as plain objects:
//   - in the app, when EXPO_PUBLIC_API_URL=demo (src/api/client.ts calls handle() directly)
//   - in the tests, behind MSW (src/test/server.ts), as if it were a server at an address
// Milestone 1 adds your brief's resources and RULES, each in its own file, with a test per rule.
import { handleItems } from '@/mock-api/items';
import {
  type MockRequest,
  type MockResponse,
  problem,
  type ResourceRequest,
} from '@/mock-api/respond';
import { handleRentals } from '@/rentals/rentals';

// The first part of the path picks the resource: /items/i3 -> handleItems with id 'i3'
const resources: Record<string, (request: ResourceRequest) => MockResponse> = {
  items: handleItems,
  rentals: handleRentals,
};

/** '/items/i3?status=open' -> ['items', 'i3'] and { status: 'open' } (no URL class needed) */
function parsePath(path: string): { segments: string[]; query: Record<string, string> } {
  const [pathname = '', search = ''] = path.split('?', 2);
  const segments = pathname.split('/').filter(Boolean).map(decodeURIComponent);
  const query: Record<string, string> = {};
  for (const pair of search.split('&').filter(Boolean)) {
    const [key = '', value = ''] = pair.split('=', 2);
    query[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, ' '));
  }
  return { segments, query };
}

/** Answer one request. `path` is what follows /api, with its query: '/items?status=open' */
export function handle({ method, path, body }: MockRequest): MockResponse {
  const { segments, query } = parsePath(path);
  const [resource = '', id, ...rest] = segments;
  const handler = Object.hasOwn(resources, resource) ? resources[resource] : undefined;
  if (handler === undefined || rest.length > 0) {
    return problem(404, 'not_found', `There is nothing at ${path}.`);
  }
  return handler({ method, id, query, body });
}
