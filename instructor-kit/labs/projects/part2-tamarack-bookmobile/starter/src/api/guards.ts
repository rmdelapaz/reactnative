// Guards: functions that prove the shape of data from outside the app (the API, the phone's storage)
// before anyone uses it (Lesson 5.1 and the HQ's client). Each one answers true only for a whole,
// valid value.
import type { ApiErrorBody, Book, Hold, Patron, SignInResponse, Stop } from '@/api/types';

/** An object (not null, not an array), so its properties can be read */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** A check for one item becomes a check for a list of them */
export function isListOf<T>(isT: (value: unknown) => value is T) {
  return (value: unknown): value is T[] => Array.isArray(value) && value.every(isT);
}

export function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return isRecord(value) && typeof value.error === 'string' && typeof value.message === 'string';
}

function isPatron(value: unknown): value is Patron {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.cardNumber === 'string'
  );
}

export function isSignInResponse(value: unknown): value is SignInResponse {
  return isRecord(value) && typeof value.token === 'string' && isPatron(value.patron);
}

// ---------------------------------------------------------------- TODO R3a
// Write the three guards below in the style of isPatron and isSignInResponse above. Each one answers
// true only for a whole, valid value, as the API sends it (bookmobile-api/README.md, src/api/types.ts):
// every text field a string, the numbers numbers, and day / audience / status one of their union's
// values (a value from outside the union is false). Lesson 5.1 and the HQ's client show the pattern.

/** One stop, as GET /api/stops lists them */
export function isStop(value: unknown): value is Stop {
  throw new Error(`TODO R3a: is ${JSON.stringify(value)} a Stop?`);
}

/** One book, as GET /api/books lists them */
export function isBook(value: unknown): value is Book {
  throw new Error(`TODO R3a: is ${JSON.stringify(value)} a Book?`);
}

/** One hold, as GET and POST /api/holds send them */
export function isHold(value: unknown): value is Hold {
  throw new Error(`TODO R3a: is ${JSON.stringify(value)} a Hold?`);
}
