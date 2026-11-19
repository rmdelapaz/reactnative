// Bookmobile Stops' Zod schemas (Lesson 5.4): each one is a form's type AND its checks. The messages
// are the API's own, so the phone and the server say the same thing.
import { z } from 'zod';

// ---------------------------------------------------------------- sign in (given)

export const signInSchema = z.object({
  // A library card prints its number in two groups ("2145 0021"): spaces are fine, then removed
  cardNumber: z
    .string()
    .transform((typed) => typed.replace(/\s+/g, ''))
    .pipe(z.string().regex(/^\d{8}$/, 'Enter the 8-digit number on your library card.')),
  pin: z.string().regex(/^\d{4}$/, 'Enter your 4-digit PIN.'),
});

export type SignInValues = z.input<typeof signInSchema>;
export type SignInData = z.output<typeof signInSchema>;

// ---------------------------------------------------------------- TODO R5a (done): a hold

export const holdSchema = z.object({
  stopId: z.string().min(1, 'Choose the stop where you will pick it up.'),
  note: z.string().trim().max(120, 'Keep the note to 120 characters or fewer.'),
});

/** What the hold form's fields hold */
export type HoldValues = z.input<typeof holdSchema>;
/** What a successful check gives back: ready to go into the queue */
export type HoldData = z.output<typeof holdSchema>;
