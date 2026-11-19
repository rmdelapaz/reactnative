// What the mock API's handlers take and give back: plain objects, the same on a phone, in the web
// preview and in Node (no Request, Response or URL classes needed)
import type { ApiErrorBody, ErrorCode } from '@/api/types';

export type MockRequest = { method: string; path: string; body?: unknown };
export type MockResponse = { status: number; body: unknown };

/** One request to one resource: GET /items -> id undefined; PATCH /items/i3 -> id 'i3' */
export type ResourceRequest = {
  method: string;
  id: string | undefined;
  query: Record<string, string>;
  body: unknown;
};

export function answer(status: number, body: unknown): MockResponse {
  return { status, body };
}

/** An error answer in the API's shape (ApiErrorBody), with a field's message when there is one */
export function problem(
  status: number,
  error: ErrorCode,
  message: string,
  fieldErrors?: Record<string, string[]>,
): MockResponse {
  const body: ApiErrorBody = fieldErrors ? { error, message, fieldErrors } : { error, message };
  return answer(status, body);
}
