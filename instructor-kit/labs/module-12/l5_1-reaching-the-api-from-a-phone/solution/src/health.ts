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
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${base}/api/health`, { signal: controller.signal });
    if (!response.ok) {
      return { kind: 'failed', message: `The server at ${base} answered ${response.status}.` };
    }
    const data: unknown = await response.json();
    if (!isHealth(data)) {
      return { kind: 'failed', message: `The server at ${base} does not answer like shoreline-api.` };
    }
    return { kind: 'connected', today: data.today };
  } catch {
    // Aborted by our timer, or refused at once: either way, say which address
    return {
      kind: 'failed',
      message: controller.signal.aborted
        ? `No answer from ${base} within ${timeoutMs} ms.`
        : `Could not reach the server at ${base}.`,
    };
  } finally {
    clearTimeout(timer);
  }
}
