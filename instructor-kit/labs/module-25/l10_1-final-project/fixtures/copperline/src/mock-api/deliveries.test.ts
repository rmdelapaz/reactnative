// Copperline Couriers' rules (Milestone 1): one test per rule, before any screen exists
import { resetDb } from '@/mock-api/db';
import { handle } from '@/mock-api/handle';

beforeEach(() => resetDb());

function change(id: string, body: unknown) {
  return handle({ method: 'PATCH', path: `/deliveries/${id}`, body });
}

it("lists one rider's run sheet in the order of the drop-off windows", () => {
  const run = handle({ method: 'GET', path: '/deliveries?rider=r1' });
  expect(run.status).toBe(200);
  expect(run.body).toEqual(['d1', 'd2', 'd3', 'd4'].map((id) => expect.objectContaining({ id })));
});

it('moves a delivery one step at a time, never skipping one', () => {
  expect(change('d3', { status: 'delivered' })).toEqual({
    status: 409,
    body: { error: 'conflict', message: 'An Assigned delivery can only move to Picked up.' },
  });
  expect(change('d3', { status: 'picked-up' })).toMatchObject({
    status: 200,
    body: { status: 'picked-up' },
  });
});

it('needs a photo to deliver and a reason to fail', () => {
  expect(change('d2', { status: 'delivered' })).toMatchObject({
    status: 400,
    body: { fieldErrors: { proofPhotoId: ['Add a photo of the parcel at the door.'] } },
  });
  expect(change('d2', { status: 'failed', failedReason: ' ' })).toMatchObject({
    status: 400,
    body: { fieldErrors: { failedReason: ['Say why it could not be delivered.'] } },
  });
  expect(change('d2', { status: 'delivered', proofPhotoId: 'p9' })).toMatchObject({
    status: 200,
    body: { status: 'delivered', proofPhotoId: 'p9', failedReason: null },
  });
});

it('never changes a finished delivery (the rule that must not break)', () => {
  expect(change('d1', { status: 'failed', failedReason: 'Nobody home' })).toMatchObject({
    status: 409,
    body: { message: 'A Delivered delivery is finished: it cannot change.' },
  });
});
