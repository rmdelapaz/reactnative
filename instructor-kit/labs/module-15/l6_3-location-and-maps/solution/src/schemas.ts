// The pickup form's rules: the shape of a code. Only the server knows the right one.
import { z } from 'zod';

export const pickupSchema = z.object({
  // Kept as text: it is a code to compare, not a number to count with ("0427" is not 427)
  code: z
    .string()
    .trim()
    .regex(/^\d{4}$/, 'Enter the 4-digit code on the tag.'),
});

/** What the form holds */
export type PickupValues = z.input<typeof pickupSchema>;
