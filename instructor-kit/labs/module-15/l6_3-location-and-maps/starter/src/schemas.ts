// The pickup form's rules: the shape of a code. Only the server knows the right one.
import { z } from 'zod';

export const pickupSchema = z.object({
  // TODO (Task 3): a code made of digits is a number?
  code: z.coerce.number().int().min(0).max(9999),
});

/** What the form holds */
export type PickupValues = z.input<typeof pickupSchema>;
