// Saltwick Kayak Hire's /rentals: the shop's bookings, and the rules only the server can keep.
// The shape of the starter's src/mock-api/items.ts: one handler, every rule a branch that answers with
// the right status code and an error body the app already understands (ApiErrorBody).
import { answer, type MockResponse, problem, type ResourceRequest } from '@/mock-api/respond';
import { kayaks, rentalDb } from '@/rentals/db';
import { isRentalStatus, nextSteps, rentalStatusLabels } from '@/rentals/labels';
import type { NewRental, Rental } from '@/rentals/types';

/** Text with something in it, trimmed; anything else is null */
function textIn(record: object, key: string): string | null {
  const value: unknown = key in record ? Reflect.get(record, key) : null;
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

/** POST /rentals: the booking it asks for, or the 400 that says which field is wrong */
function checkNew(body: unknown): NewRental | MockResponse {
  const fields = typeof body === 'object' && body !== null ? body : {};
  const kayakId = textIn(fields, 'kayakId');
  const customer = textIn(fields, 'customer');
  const start = textIn(fields, 'start');
  const end = textIn(fields, 'end');
  if (kayakId === null || !kayaks.some((kayak) => kayak.id === kayakId)) {
    return problem(400, 'bad_request', 'Choose a kayak.', { kayakId: ['Choose a kayak.'] });
  }
  if (customer === null) {
    const message = 'Write the customer’s first name.';
    return problem(400, 'bad_request', message, { customer: [message] });
  }
  if (start === null || end === null || Number.isNaN(Date.parse(start)) || !(Date.parse(end) > Date.parse(start))) {
    const message = 'The return time must be after the start.';
    return problem(400, 'bad_request', message, { end: [message] });
  }
  return { kayakId, customer, start, end };
}

/** Task 2: the rule only the server can check (it is the one that sees every booking): a kayak that is
 * booked or out cannot be booked again for any minute of the same time. Cancelled and returned rentals
 * free the kayak. Two times overlap when each starts before the other ends. */
function clash(booking: NewRental): Rental | undefined {
  const start = Date.parse(booking.start);
  const end = Date.parse(booking.end);
  return rentalDb.rentals.find(
    (rental) =>
      rental.kayakId === booking.kayakId &&
      (rental.status === 'booked' || rental.status === 'out') &&
      Date.parse(rental.start) < end &&
      start < Date.parse(rental.end),
  );
}

/** "A Booked rental", "An Out on the water rental" */
function aRental(status: Rental['status']): string {
  const label = rentalStatusLabels[status];
  return `${/^[AEIOU]/.test(label) ? 'An' : 'A'} ${label} rental`;
}

/** Task 3: PATCH /rentals/:id with { status }: one step at a time, and a finished rental never changes */
function change(rental: Rental, body: unknown): MockResponse {
  const status: unknown = typeof body === 'object' && body !== null ? Reflect.get(body, 'status') : undefined;
  if (!isRentalStatus(status)) {
    return problem(400, 'bad_request', 'Choose the next status.', { status: ['Choose the next status.'] });
  }
  // The rule that must never break, whatever a phone sends: no skipped steps, no going back
  const allowed = nextSteps[rental.status];
  if (!allowed.includes(status)) {
    const message =
      allowed.length === 0
        ? `${aRental(rental.status)} is finished: it cannot change.`
        : `${aRental(rental.status)} can only move to ${allowed.map((next) => rentalStatusLabels[next]).join(' or ')}.`;
    return problem(409, 'conflict', message);
  }
  rental.status = status;
  return answer(200, rental);
}

export function handleRentals({ method, id, query, body }: ResourceRequest): MockResponse {
  // GET /rentals?kayak=k1: one kayak's bookings (or all of them), in the order they start
  if (id === undefined && method === 'GET') {
    const list = rentalDb.rentals
      .filter((rental) => query.kayak === undefined || rental.kayakId === query.kayak)
      .sort((a, b) => a.start.localeCompare(b.start)); // filter made a new array
    return answer(200, list);
  }

  // POST /rentals: a new booking, if its fields are right AND the kayak is free
  if (id === undefined && method === 'POST') {
    const booking = checkNew(body);
    if (!('customer' in booking)) {
      return booking; // a 400 with the field it is about
    }
    const taken = clash(booking);
    if (taken !== undefined) {
      const name = kayaks.find((kayak) => kayak.id === booking.kayakId)?.name ?? booking.kayakId;
      const message = `${name} is already booked for part of that time.`;
      return problem(409, 'conflict', message, { start: [message] });
    }
    const rental: Rental = { id: `r${rentalDb.nextNumber++}`, ...booking, status: 'booked' };
    rentalDb.rentals.push(rental);
    return answer(201, rental);
  }

  const rental = rentalDb.rentals.find((candidate) => candidate.id === id);
  if (id === undefined || rental === undefined) {
    return id === undefined
      ? problem(400, 'bad_request', `${method} /rentals is not supported.`)
      : problem(404, 'not_found', 'There is no rental with this id.');
  }
  if (method === 'GET') {
    return answer(200, rental);
  }
  if (method === 'PATCH') {
    return change(rental, body);
  }
  return problem(400, 'bad_request', `${method} /rentals/${rental.id} is not supported.`);
}
