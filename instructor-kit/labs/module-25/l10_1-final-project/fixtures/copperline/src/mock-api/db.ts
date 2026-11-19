// The mock API's sample data, in memory: it starts again every time the app (or a test) starts.
// Milestone 1: 6 to 12 records per type of your brief, one of them awkward on purpose.
import type { Delivery, DeliveryStatus, Item, Place, Rider } from '@/api/types';

const day = 24 * 60 * 60 * 1000;

/** An instant some days before now, so the sample data always looks recent */
function daysAgo(days: number): string {
  return new Date(Date.now() - days * day).toISOString();
}

function sampleItems(): Item[] {
  return [
    { id: 'i6', name: 'Charge the tablet', note: null, status: 'open', createdAt: daysAgo(0) },
    {
      id: 'i5',
      name: 'Order more gloves',
      note: 'Medium and large, two boxes each.',
      status: 'open',
      createdAt: daysAgo(1),
    },
    {
      // The awkward one: a long name that wraps on a narrow phone, and no note
      id: 'i4',
      name: 'An item with a long name that wraps onto two lines',
      note: null,
      status: 'open',
      createdAt: daysAgo(2),
    },
    {
      id: 'i3',
      name: 'Check the first-aid kit',
      note: 'Plasters ran low last time.',
      status: 'done',
      createdAt: daysAgo(4),
    },
    { id: 'i2', name: 'Book the meeting room', note: null, status: 'done', createdAt: daysAgo(6) },
    {
      id: 'i1',
      name: 'Print the sign-up sheet',
      note: 'Twenty copies.',
      status: 'done',
      createdAt: daysAgo(9),
    },
  ];
}

/** Today in the phone's time zone, "2030-04-02": the run sheet is always today's */
function today(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export const sampleRiders: Rider[] = [
  { id: 'r1', name: 'Noor Haddad' },
  { id: 'r2', name: 'Mateo Lindqvist' },
];

const bakery: Place = { name: 'Copperline Bakery', address: '12 Foundry Lane', note: null };

/** One stop on today's run, picked up at the bakery */
function stop(
  id: string,
  riderId: string,
  dropoff: Place,
  [from, to]: [string, string],
  status: DeliveryStatus = 'assigned',
): Delivery {
  return {
    id,
    runDate: today(),
    riderId,
    pickup: bakery,
    dropoff,
    window: { from, to },
    status,
    failedReason: null,
    proofPhotoId: status === 'delivered' ? 'p1' : null,
  };
}

function sampleDeliveries(): Delivery[] {
  return [
    stop('d1', 'r1', { name: 'Gearhouse Cafe', address: '3 Mill Street', note: null },
      ['08:00', '09:00'], 'delivered'),
    stop('d2', 'r1', { name: 'Harbor Print Shop', address: '48 Quay Road', note: 'Side door' },
      ['09:00', '10:00'], 'picked-up'),
    stop('d3', 'r1', { name: 'Lantern Books', address: '7 Chapel Row', note: null },
      ['10:00', '11:00']),
    // The awkward one: a long name, address and note, for the narrowest phone and the largest text
    stop('d4', 'r1', {
      name: 'Riverside Community Center, East Wing',
      address: 'Unit 14B, Riverside Business Park, 220 Old Canal Road',
      note: 'Ask at the front desk; the loading bay closes at noon on weekdays.',
    }, ['11:00', '12:00']),
    stop('d5', 'r2', { name: 'Pinecone Florist', address: '19 Elm Parade', note: null },
      ['09:30', '10:30']),
    stop('d6', 'r2', { name: 'Tidewater Dental', address: '5 Beacon Hill', note: 'Reception' },
      ['13:00', '14:00']),
  ];
}

export const db = { items: sampleItems(), deliveries: sampleDeliveries(), nextNumber: 7 };

/** Put the sample data back (every test starts from it) */
export function resetDb(): void {
  db.items = sampleItems();
  db.deliveries = sampleDeliveries();
  db.nextNumber = 7;
}

/** A new id, as a server would make one */
export function nextId(): string {
  const id = `i${db.nextNumber}`;
  db.nextNumber += 1;
  return id;
}
