// The contract between the screens, the API (or the mock API) and the tests: write your brief's
// types here FIRST, before any screen (worksheet section 2). Saltwick Kayak Hire's own types are
// in src/rentals/types.ts (Milestone 1); the starter's example Item was deleted in Milestone 2.

/** An instant as the API sends it: an ISO 8601 string such as "2030-04-02T09:30:00.000Z" */
export type Timestamp = string;

/** The error codes the API answers with, and the shape of an error answer */
export type ErrorCode = 'bad_request' | 'not_found' | 'conflict' | 'server_error';

export interface ApiErrorBody {
  error: ErrorCode;
  message: string;
  /** For 400 and 409: the field the message belongs to, so the form shows it under that field */
  fieldErrors?: Record<string, string[]>;
}
