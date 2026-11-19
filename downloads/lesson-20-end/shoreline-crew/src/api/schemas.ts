// Shoreline Crew's Zod schemas (new, in the HQ's style): each one is a form's type AND its checks.
// The messages are shoreline-api's own, so the phone and the server say the same thing.
import { z } from 'zod';

import type { CleanupEvent, NewCleanupLog } from '@/api/types';
import { debrisCategories } from '@/utils/debris';

// ---------------------------------------------------------------- sign in

export const signInSchema = z.object({
  // Trimmed first: a phone keyboard's autocorrect likes to add a space after an address
  email: z.string().trim().pipe(z.email('Enter an email address.')),
  password: z.string().min(1, 'Enter your password.'),
});

/** What the sign-in form holds and sends (the same: two strings) */
export type SignInValues = z.input<typeof signInSchema>;
export type SignInData = z.output<typeof signInSchema>;

// ---------------------------------------------------------------- a debris log

// A count typed into a box: digits only, so an empty box is a message, not a silent 0
// (the HQ's wholeNumber from Lesson 8.2 of the web course)
function wholeNumber(max: number, message: string) {
  return z
    .string()
    .trim()
    .regex(/^\d+$/, message)
    .transform(Number)
    .refine((count) => count <= max, message);
}

const weightRule = 'Weight must be a number of kilograms from 0 to 5000.';

export const debrisLogSchema = z
  .object({
    // One box per kind of debris: { 'plastic-bottles': '12', glass: '0', ... }
    counts: z.record(
      z.enum(debrisCategories),
      wholeNumber(100_000, 'Count must be a whole number from 0 to 100000.'),
    ),
    bags: wholeNumber(500, 'Bags must be a whole number from 0 to 500.'),
    weightKg: z
      .string()
      .trim()
      // Many phones set to other languages offer a comma as the decimal key: 2,5 means 2.5
      .transform((typed) => typed.replace(',', '.'))
      .pipe(z.string().regex(/^\d+(\.\d+)?$/, weightRule))
      .transform(Number)
      .refine((kg) => kg <= 5000, weightRule),
    note: z.string().trim().max(500, 'Keep the note to 500 characters or fewer.'),
  })
  // What the API wants: only the kinds of debris that were found, as a list
  .transform(({ counts, ...rest }) => ({
    ...rest,
    items: debrisCategories
      .map((category) => ({ category, count: counts[category] }))
      .filter((item) => item.count > 0),
  }));

/** What the log form's fields hold: text, as typed */
export type DebrisLogValues = z.input<typeof debrisLogSchema>;

/** What a successful check gives back: numbers and a list, ready to send */
export type DebrisLogData = z.output<typeof debrisLogSchema>;

/** A log ready to go: everything POST /api/events/:id/logs needs, plus its cleanup for the logbook.
 * Lesson 5.5 keeps exactly this in the offline queue. */
export type LogToSend = { event: CleanupEvent; log: NewCleanupLog };

/** The form's answer as the API's NewCleanupLog. clientId and recordedAt are made on the phone:
 * the id once per log (a resend is then recognized), the time when the volunteer pressed Send. */
export function toNewLog(data: DebrisLogData, clientId: string, recordedAt: Date): NewCleanupLog {
  return { clientId, recordedAt: recordedAt.toISOString(), ...data };
}
