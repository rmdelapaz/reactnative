// Saltwick's sample data, in memory (the starter's db.ts pattern): it starts again with every test.
// Bookings fall on today, so the demo never looks stale; one record is awkward on purpose.
import type { Kayak, Rental } from '@/rentals/types';

/** Today at hour:minute in the phone's time zone, as the API sends it (ISO 8601) */
export function at(hour: number, minute = 0): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute).toISOString();
}

export const kayaks: Kayak[] = [
  { id: 'k1', name: 'Puffin', kind: 'single' },
  { id: 'k2', name: 'Tern', kind: 'single' },
  { id: 'k3', name: 'Cormorant', kind: 'tandem' },
  // The awkward one: a long painted name, for the narrowest phone and the largest text
  { id: 'k4', name: 'The Harbormaster’s Daughter (sea kayak)', kind: 'tandem' },
];

function sampleRentals(): Rental[] {
  return [
    { id: 'r1', kayakId: 'k1', customer: 'Ines', start: at(9), end: at(11), status: 'returned' },
    { id: 'r2', kayakId: 'k1', customer: 'Tomas', start: at(13), end: at(15), status: 'booked' },
    { id: 'r3', kayakId: 'k2', customer: 'Priya', start: at(10), end: at(12), status: 'out' },
    { id: 'r4', kayakId: 'k3', customer: 'Wendell', start: at(16), end: at(17, 30), status: 'booked' },
    { id: 'r5', kayakId: 'k3', customer: 'Ama', start: at(11), end: at(12), status: 'cancelled' },
  ];
}

export const rentalDb = { rentals: sampleRentals(), nextNumber: 6 };

/** Put the sample data back (every test starts from it) */
export function resetRentals(): void {
  rentalDb.rentals = sampleRentals();
  rentalDb.nextNumber = 6;
}
