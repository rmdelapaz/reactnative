// Copperline Couriers' /deliveries: a rider's run sheet, and status changes one step at a time
import type { Delivery } from '@/api/types';
import { db } from '@/mock-api/db';
import { answer, type MockResponse, problem, type ResourceRequest } from '@/mock-api/respond';
import { deliveryStatusLabels, isDeliveryStatus, nextSteps } from '@/utils/deliveries';

type Change = Pick<Delivery, 'status' | 'proofPhotoId' | 'failedReason'>;

/** Text with something in it, trimmed; anything else is null */
function textIn(record: object, key: string): string | null {
  const value: unknown = key in record ? Reflect.get(record, key) : null;
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

/** "An Assigned delivery", "A Picked up delivery" */
function aDelivery(status: Delivery['status']): string {
  const label = deliveryStatusLabels[status];
  return `${/^[AEIOU]/.test(label) ? 'An' : 'A'} ${label} delivery`;
}

/** PATCH /deliveries/:id: the change it asks for, checked against the rules, or the refusal */
function checkChange(delivery: Delivery, body: unknown): Change | MockResponse {
  const changes = typeof body === 'object' && body !== null ? body : {};
  const status: unknown = Reflect.get(changes, 'status');
  if (!isDeliveryStatus(status)) {
    return problem(400, 'bad_request', 'Choose the next status.', {
      status: ['Choose the next status.'],
    });
  }
  // The rule the server must keep, whatever a phone sends: no skipped or repeated steps
  const allowed = nextSteps[delivery.status];
  if (!allowed.includes(status)) {
    const message =
      allowed.length === 0
        ? `${aDelivery(delivery.status)} is finished: it cannot change.`
        : `${aDelivery(delivery.status)} can only move to ${allowed
            .map((next) => deliveryStatusLabels[next])
            .join(' or ')}.`;
    return problem(409, 'conflict', message);
  }
  const change: Change = {
    status,
    proofPhotoId: status === 'delivered' ? textIn(changes, 'proofPhotoId') : null,
    failedReason: status === 'failed' ? textIn(changes, 'failedReason') : null,
  };
  if (status === 'delivered' && change.proofPhotoId === null) {
    const message = 'Add a photo of the parcel at the door.';
    return problem(400, 'bad_request', message, { proofPhotoId: [message] });
  }
  if (status === 'failed' && change.failedReason === null) {
    const message = 'Say why it could not be delivered.';
    return problem(400, 'bad_request', message, { failedReason: [message] });
  }
  return change;
}

export function handleDeliveries({ method, id, query, body }: ResourceRequest): MockResponse {
  // GET /deliveries?rider=r1: one rider's run sheet, in the order of the drop-off windows
  if (id === undefined && method === 'GET') {
    const run = db.deliveries
      .filter((delivery) => query.rider === undefined || delivery.riderId === query.rider)
      .sort((a, b) => a.window.from.localeCompare(b.window.from)); // filter made a new array
    return answer(200, run);
  }
  const delivery = db.deliveries.find((candidate) => candidate.id === id);
  if (delivery === undefined) {
    return problem(404, 'not_found', 'There is no delivery with this id.');
  }
  if (method === 'GET') {
    return answer(200, delivery);
  }
  if (method === 'PATCH') {
    const checked = checkChange(delivery, body);
    if (!('proofPhotoId' in checked)) {
      return checked; // a refusal: 400 or 409
    }
    Object.assign(delivery, checked);
    return answer(200, delivery);
  }
  return problem(400, 'bad_request', `${method} /deliveries/${delivery.id} is not supported.`);
}
