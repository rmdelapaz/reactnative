// Saltwick Kayak Hire (Lab 10.1, a practice brief): a harbor shop that rents kayaks by the hour.
// Types first: the screens, the mock API and the tests all read these. In a real project they go in
// src/api/types.ts next to the starter's Item; the lab keeps them in their own folder.
import type { Timestamp } from '@/api/types';

/** The two kinds of kayak on the rack */
export type KayakKind = 'single' | 'tandem';

export interface Kayak {
  id: string;
  /** Every kayak has a painted name: "Puffin" */
  name: string;
  kind: KayakKind;
}

/** One step at a time: booked -> out -> returned, or booked -> cancelled */
export type RentalStatus = 'booked' | 'out' | 'returned' | 'cancelled';

export interface Rental {
  id: string;
  kayakId: string;
  /** The customer's first name only: the shop needs nothing more (worksheet section 14) */
  customer: string;
  start: Timestamp;
  end: Timestamp;
  status: RentalStatus;
}

/** What the booking form sends (POST /rentals): the server makes the id and the status */
export type NewRental = Pick<Rental, 'kayakId' | 'customer' | 'start' | 'end'>;

/** What PATCH /rentals/:id may change */
export type RentalChanges = Pick<Rental, 'status'>;
