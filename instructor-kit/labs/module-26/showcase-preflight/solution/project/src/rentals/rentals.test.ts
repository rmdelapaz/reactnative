// Tasks 2 and 3 (do not edit): Saltwick's rules, one test per rule, as plain function calls through the
// starter's handle(): no network, no screens (Lesson 8.2). They pass once /rentals is registered in
// src/mock-api/handle.ts and the rules are written.
import { handle } from '@/mock-api/handle';
import { at, resetRentals } from '@/rentals/db';

beforeEach(() => resetRentals());

function book(body: object) {
  return handle({ method: 'POST', path: '/rentals', body });
}

function change(id: string, body: unknown) {
  return handle({ method: 'PATCH', path: `/rentals/${id}`, body });
}

it("Task 2: lists one kayak's bookings in the order they start", () => {
  const list = handle({ method: 'GET', path: '/rentals?kayak=k1' });
  expect(list.status).toBe(200);
  expect(list.body).toEqual(['r1', 'r2'].map((id) => expect.objectContaining({ id })));
});

it('Task 2: books a free kayak, with the id and the status the server makes', () => {
  expect(book({ kayakId: 'k2', customer: ' Lena ', start: at(14), end: at(16) })).toMatchObject({
    status: 201,
    body: { id: 'r6', kayakId: 'k2', customer: 'Lena', status: 'booked' },
  });
});

it('Task 2: says which field is wrong', () => {
  expect(book({ kayakId: 'k9', customer: 'Lena', start: at(14), end: at(16) })).toMatchObject({
    status: 400,
    body: { fieldErrors: { kayakId: ['Choose a kayak.'] } },
  });
  expect(book({ kayakId: 'k2', customer: 'Lena', start: at(16), end: at(14) })).toMatchObject({
    status: 400,
    body: { fieldErrors: { end: ['The return time must be after the start.'] } },
  });
});

it('Task 2: never books a kayak twice for the same time (a rule only the server can check)', () => {
  expect(book({ kayakId: 'k1', customer: 'Lena', start: at(14), end: at(16) })).toEqual({
    status: 409,
    body: {
      error: 'conflict',
      message: 'Puffin is already booked for part of that time.',
      fieldErrors: { start: ['Puffin is already booked for part of that time.'] },
    },
  });
  // a returned rental and a cancelled one free the kayak
  expect(book({ kayakId: 'k1', customer: 'Lena', start: at(9), end: at(10) }).status).toBe(201);
  expect(book({ kayakId: 'k3', customer: 'Lena', start: at(11), end: at(12) }).status).toBe(201);
});

it('Task 3: moves a rental one step at a time', () => {
  expect(change('r2', { status: 'returned' })).toEqual({
    status: 409,
    body: { error: 'conflict', message: 'A Booked rental can only move to Out on the water or Cancelled.' },
  });
  expect(change('r2', { status: 'out' })).toMatchObject({ status: 200, body: { status: 'out' } });
  expect(change('r2', { status: 'lost' })).toMatchObject({ status: 400 });
});

it('Task 3: never changes a finished rental (the rule that must not break)', () => {
  expect(change('r1', { status: 'out' })).toMatchObject({
    status: 409,
    body: { message: 'A Returned rental is finished: it cannot change.' },
  });
  expect(change('r5', { status: 'booked' })).toMatchObject({
    status: 409,
    body: { message: 'A Cancelled rental is finished: it cannot change.' },
  });
});
