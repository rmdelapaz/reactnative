import * as SecureStore from 'expo-secure-store';

// A half-typed note for a cleanup, kept on the phone so it survives a closed app
export type Draft = { eventId: string; note: string };

export const draftKey = 'shoreline-lab-draft';

function isDraft(value: unknown): value is Draft {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Draft).eventId === 'string' &&
    typeof (value as Draft).note === 'string'
  );
}

/** Save the draft without waiting: a draft that could not be saved is never worth an error on screen */
export function rememberDraft(draft: Draft): void {
  SecureStore.setItemAsync(draftKey, JSON.stringify(draft)).catch(() => {});
}

/** The draft saved on the phone, or null (no secure storage, nothing saved, or not a draft) */
export async function loadDraft(): Promise<Draft | null> {
  if (!(await SecureStore.isAvailableAsync())) return null;
  const text = await SecureStore.getItemAsync(draftKey);
  if (!text) return null;
  try {
    const value: unknown = JSON.parse(text);
    return isDraft(value) ? value : null;
  } catch {
    return null;
  }
}
