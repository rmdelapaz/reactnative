// Zod schemas (Lesson 5.4): each form's checks AND its types. The field RULES are shared, so the
// form and the mock API say the same thing; the form's schema and the API's body schema are not
// the same schema, because the form turns text into what the API stores (an empty note -> null).
import { z } from 'zod';

import type { NewItem } from '@/api/types';

const name = z
  .string()
  .trim()
  .min(1, 'Give the item a name.')
  .max(60, 'Keep the name to 60 characters or fewer.');
const note = z.string().trim().max(200, 'Keep the note to 200 characters or fewer.');

/** The New item form: what its fields hold (text), and what it hands over (NewItem) */
export const newItemSchema = z.object({
  name,
  note: note.transform((text) => (text === '' ? null : text)),
});

export type NewItemValues = z.input<typeof newItemSchema>;

/** What the API accepts in POST /items: a NewItem, with the same rules */
export const newItemBodySchema: z.ZodType<NewItem> = z.object({
  name,
  note: note.nullable(),
});
