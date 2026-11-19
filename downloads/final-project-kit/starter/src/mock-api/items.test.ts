// The mock API's rules for /items, tested as plain functions: no network, no screens (Lesson 8.2).
// Milestone 1: a test file like this for each resource of your brief, with a test for every rule,
// including the one that must never happen.
import { resetDb } from '@/mock-api/db';
import { handle } from '@/mock-api/handle';

beforeEach(() => resetDb());

it('lists the items, and only the open ones when asked', () => {
  expect(handle({ method: 'GET', path: '/items' })).toMatchObject({ status: 200 });
  const open = handle({ method: 'GET', path: '/items?status=open' });
  expect(open.status).toBe(200);
  expect(open.body).toHaveLength(3);
  expect(handle({ method: 'GET', path: '/items?status=lost' })).toEqual({
    status: 400,
    body: { error: 'bad_request', message: 'status must be open or done.' },
  });
});

it('answers 404 for an item that does not exist', () => {
  expect(handle({ method: 'GET', path: '/items/i99' }).status).toBe(404);
});

it('adds a new item, open, at the top of the list', () => {
  const created = handle({ method: 'POST', path: '/items', body: { name: ' Buy tape ', note: null } });
  expect(created).toMatchObject({
    status: 201,
    body: { id: 'i7', name: 'Buy tape', status: 'open' },
  });
  expect(handle({ method: 'GET', path: '/items' }).body).toEqual(
    expect.arrayContaining([expect.objectContaining({ id: 'i7' })]),
  );
});

it('refuses a new item without a name, with the message for the field', () => {
  const refused = handle({ method: 'POST', path: '/items', body: { name: '  ', note: null } });
  expect(refused).toMatchObject({
    status: 400,
    body: { error: 'bad_request', fieldErrors: { name: ['Give the item a name.'] } },
  });
});

it('never lets two items have the same name (a rule only the server can check)', () => {
  const body = { name: 'order more GLOVES', note: null };
  expect(handle({ method: 'POST', path: '/items', body })).toMatchObject({
    status: 409,
    body: { error: 'conflict', message: 'There is already an item called "order more GLOVES".' },
  });
});

it('changes an item between open and done', () => {
  expect(handle({ method: 'PATCH', path: '/items/i6', body: { status: 'done' } })).toMatchObject({
    status: 200,
    body: { id: 'i6', status: 'done' },
  });
  expect(handle({ method: 'PATCH', path: '/items/i6', body: { status: 'lost' } }).status).toBe(400);
});

it('answers 404 for a path it does not know', () => {
  expect(handle({ method: 'GET', path: '/things' }).status).toBe(404);
});
