// A text field always gives a string, even with the number keyboard: '' is 0, digits are a count, anything else
// is null (the desk says "Numbers only"). Lesson 5.4 does the same with Zod.
export function parseBags(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === '') return 0;
  return /^\d+$/.test(trimmed) ? Number(trimmed) : null;
}
