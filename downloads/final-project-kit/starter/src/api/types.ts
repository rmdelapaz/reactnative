// The contract between the screens, the API (or the mock API) and the tests: write your brief's
// types here FIRST, before any screen (worksheet section 1). `Item` is the starter's example:
// add your own types next to it, and delete it in Milestone 2 (tsc then lists what still uses it).

/** An instant as the API sends it: an ISO 8601 string such as "2030-04-02T09:30:00.000Z" */
export type Timestamp = string;

/** A union of literal types: the label table in src/utils/labels.ts must cover every value */
export type ItemStatus = 'open' | 'done';

export interface Item {
  id: string;
  name: string;
  /** null: no note (an empty string would be a note with nothing in it) */
  note: string | null;
  status: ItemStatus;
  createdAt: Timestamp;
}

/** What the New item form sends (POST /items): the server makes the rest */
export type NewItem = Pick<Item, 'name' | 'note'>;

/** What PATCH /items/:id may change */
export type ItemChanges = Partial<Pick<Item, 'status'>>;

/** The error codes the API answers with, and the shape of an error answer */
export type ErrorCode = 'bad_request' | 'not_found' | 'conflict' | 'server_error';

export interface ApiErrorBody {
  error: ErrorCode;
  message: string;
  /** For 400 and 409: the field the message belongs to, so the form shows it under that field */
  fieldErrors?: Record<string, string[]>;
}
