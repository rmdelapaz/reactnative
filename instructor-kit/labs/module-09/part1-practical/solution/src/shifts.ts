// The three shifts of a repair café day
export type Shift = 'setup' | 'repair' | 'cleanup';

export type Volunteer = { id: string; name: string; shift: Shift };

// Who signed up so far (the coordinator's list)
export const signedUp: Volunteer[] = [
  { id: 'v1', name: 'Ade', shift: 'repair' },
  { id: 'v2', name: 'Bea', shift: 'setup' },
  { id: 'v3', name: 'Gus', shift: 'repair' },
  { id: 'v4', name: 'Noor', shift: 'cleanup' },
];

const labels: Record<Shift, string> = {
  setup: 'Setup crew (9:00)',
  repair: 'Repair tables (10:00 to 13:00)',
  cleanup: 'Cleanup crew (13:00)',
};

export function shiftLabel(shift: Shift): string {
  return labels[shift];
}
