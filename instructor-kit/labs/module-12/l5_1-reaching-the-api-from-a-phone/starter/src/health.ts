// Task 3: ask GET /api/health, the way a connection check does. A wrong address on Wi-Fi can hang
// for a long time instead of failing, and "Could not reach the server" does not say which server.
export type HealthCheck = { kind: 'connected'; today: string } | { kind: 'failed'; message: string };

interface Health {
  ok: true;
  today: string;
}

function isHealth(value: unknown): value is Health {
  return (
    typeof value === 'object' &&
    value !== null &&
    'ok' in value &&
    value.ok === true &&
    'today' in value &&
    typeof value.today === 'string'
  );
}

/** Ask `base` (such as http://192.168.1.42:4000) whether it is up; give up after timeoutMs */
export async function checkHealth(base: string, timeoutMs = 8000): Promise<HealthCheck> {
  // TODO 3: stop waiting after timeoutMs (an AbortController), and name `base` in every message
  try {
    const response = await fetch(`${base}/api/health`);
    const data: unknown = await response.json();
    if (response.ok && isHealth(data)) {
      return { kind: 'connected', today: data.today };
    }
    return { kind: 'failed', message: 'Something went wrong.' };
  } catch {
    return { kind: 'failed', message: 'Could not reach the server.' };
  }
}
