// The Bookmobile API's contract: every shape it sends and takes. The app keeps a copy of this file
// as src/api/types.ts (never edited there: a change starts here).

/** A day the van goes out (it rests on Sundays) */
export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

/** A time of day on a 24-hour clock, as 'HH:MM' ('14:30') */
export type TimeString = string;

/** One place the van parks every week */
export interface Stop {
  id: string; // 's01' ... 's08'
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  day: Weekday;
  start: TimeString;
  end: TimeString;
}

export type Audience = 'children' | 'teens' | 'adults';

/** A book in the collection. onVan: on the van this week (otherwise a hold brings it on the next trip) */
export interface Book {
  id: string; // 'b01' ... 'b12'
  title: string;
  author: string;
  audience: Audience;
  onVan: boolean;
}

/** A library card holder */
export interface Patron {
  id: string;
  name: string;
  cardNumber: string; // 8 digits
}

export interface SignInRequest {
  cardNumber: string; // 8 digits, no spaces
  pin: string; // 4 digits
}

export interface SignInResponse {
  token: string;
  patron: Patron;
}

/** 'requested': the library has it, the book is not on the van yet. 'ready': on the van, waiting at the stop */
export type HoldStatus = 'requested' | 'ready';

/** What POST /api/holds takes. clientId is made on the phone, once per hold: the same clientId twice is one hold */
export interface NewHold {
  clientId: string;
  bookId: string;
  stopId: string;
  note?: string; // up to 120 characters, for the librarian
}

/** A hold as the API keeps it, with the book's title and the stop's name for the screens */
export interface Hold {
  id: string;
  clientId: string;
  bookId: string;
  bookTitle: string;
  stopId: string;
  stopName: string;
  note: string;
  status: HoldStatus;
}

export type ErrorCode =
  | 'validation_error'
  | 'unauthorized'
  | 'not_found'
  | 'already_held'
  | 'hold_limit'
  | 'conflict'
  | 'server_error';

/** Every error answer: a code for programs, a message for people, and per-field messages after a 400 */
export interface ApiErrorBody {
  error: ErrorCode;
  message: string;
  fieldErrors?: Record<string, string[]>;
}
