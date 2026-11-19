// The shift report a crew leader sends at the end of a cleanup: the form's type AND its checks (Zod 4)
import { z } from 'zod';

// A count typed into a box: digits only, so an empty box is a message, not a silent 0 (the HQ's wholeNumber)
function wholeNumber(min: number, max: number, message: string) {
  return z
    .string()
    .trim()
    .regex(/^\d+$/, message)
    .transform(Number)
    .refine((count) => count >= min && count <= max, message);
}

const hoursRule = 'Hours must be a number from 0 to 12.';

export const shiftReportSchema = z.object({
  leader: z.string().trim().min(1, "Enter the crew leader's name."),
  volunteers: wholeNumber(1, 200, 'Volunteers must be a whole number from 1 to 200.'),
  // TODO 2: a phone set to German, French or Spanish types 2,5 on its decimal pad. Accept it as 2.5.
  hours: z
    .string()
    .trim()
    .regex(/^\d+(\.\d+)?$/, hoursRule)
    .transform(Number)
    .refine((hours) => hours <= 12, hoursRule),
});

/** What the fields hold: text, as typed */
export type ShiftReportValues = z.input<typeof shiftReportSchema>;

/** What a successful check gives back: numbers, ready to send */
export type ShiftReport = z.output<typeof shiftReportSchema>;
