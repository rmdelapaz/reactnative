// The tables every union needs (Lesson 10.1, Step 5): a Record, so a new value cannot be forgotten here.
import type { KayakKind, Rental, RentalStatus } from '@/rentals/types';

export const kayakKindLabels: Record<KayakKind, string> = {
  single: 'Single',
  tandem: 'Tandem',
};

// Task 1: the shop added "cancelled" to RentalStatus last week. Run the type check: it lists every
// table that has not learned the new status yet. Decide its words and its moves (is it finished?).
export const rentalStatusLabels: Record<RentalStatus, string> = {
  booked: 'Booked',
  out: 'Out on the water',
  returned: 'Returned',
};

// The only moves a rental can make: the mock API refuses anything else (409)
export const nextSteps: Record<RentalStatus, readonly RentalStatus[]> = {
  booked: ['out'],
  out: ['returned'],
  returned: [],
};

export function isRentalStatus(value: unknown): value is RentalStatus {
  return typeof value === 'string' && Object.hasOwn(rentalStatusLabels, value);
}

/** Computed, never stored: how long the rental is, in minutes */
export function rentalMinutes(rental: Pick<Rental, 'start' | 'end'>): number {
  return Math.round((Date.parse(rental.end) - Date.parse(rental.start)) / 60_000);
}

/** Computed, never stored: is a kayak that is out on the water past its return time? */
export function isLate(rental: Pick<Rental, 'status' | 'end'>, now: Date): boolean {
  throw new Error(`TODO 1: is a ${rental.status} rental late at ${now.toISOString()}?`);
}
