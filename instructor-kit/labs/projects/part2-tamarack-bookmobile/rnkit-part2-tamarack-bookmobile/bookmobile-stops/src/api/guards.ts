// Guards: functions that prove the shape of data from outside the app (the API, the phone's storage)
// before anyone uses it (Lesson 5.1 and the HQ's client). Each one answers true only for a whole,
// valid value.
import type { ApiErrorBody, Audience, Book, Hold, HoldStatus, Patron, SignInResponse, Stop, Weekday } from '@/api/types';

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

// ---------------------------------------------------------------- TODO R3a (done)

const weekdays: Weekday[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const stopTextFields: (keyof Stop)[] = ['id', 'name', 'address', 'start', 'end'];

/** One stop, as GET /api/stops lists them */
export function isStop(value: unknown): value is Stop {
  return (
    isRecord(value) &&
    stopTextFields.every((key) => typeof value[key] === 'string') &&
    typeof value.latitude === 'number' &&
    typeof value.longitude === 'number' &&
    weekdays.some((day) => day === value.day)
  );
}

const audiences: Audience[] = ['children', 'teens', 'adults'];

/** One book, as GET /api/books lists them */
export function isBook(value: unknown): value is Book {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.author === 'string' &&
    audiences.some((audience) => audience === value.audience) &&
    typeof value.onVan === 'boolean'
  );
}

const holdStatuses: HoldStatus[] = ['requested', 'ready'];
const holdTextFields: (keyof Hold)[] = ['id', 'clientId', 'bookId', 'bookTitle', 'stopId', 'stopName', 'note'];

/** One hold, as GET and POST /api/holds send them */
export function isHold(value: unknown): value is Hold {
  return (
    isRecord(value) &&
    holdTextFields.every((key) => typeof value[key] === 'string') &&
    holdStatuses.some((status) => status === value.status)
  );
}
