// The mock API's sample data, in memory: it starts again every time the app (or a test) starts.
// Milestone 1: 6 to 12 records per type of your brief, one of them awkward on purpose.
import type { Item } from '@/api/types';

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

export const db = { items: sampleItems(), nextNumber: 7 };

/** Put the sample data back (every test starts from it) */
export function resetDb(): void {
  db.items = sampleItems();
  db.nextNumber = 7;
}

/** A new id, as a server would make one */
export function nextId(): string {
  const id = `i${db.nextNumber}`;
  db.nextNumber += 1;
  return id;
}
