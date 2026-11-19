// The holds waiting to be sent (Lesson 5.5): a Zustand store that saves itself on the phone with
// AsyncStorage, so a hold placed with one bar of signal survives closing the app.
import { create } from 'zustand';

/** 'waiting': not on the server yet. 'refused': the server said no, and would say it again. */
export type QueuedHoldStatus = 'waiting' | 'refused';

/** What the hold form makes: what POST /api/holds needs, plus the names the screens show */
export type HoldToSend = {
  clientId: string; // made once per hold on this phone: the same hold sent twice is one hold
  bookId: string;
  bookTitle: string;
  stopId: string;
  stopName: string;
  note: string;
};

/** One hold in the queue: what to send, whose it is, and how sending it has gone so far */
export type QueuedHold = HoldToSend & {
  patronId: string; // only this patron's sign-in may send it
  status: QueuedHoldStatus;
  attempts: number; // tries that got no answer
  problem: string | null; // the server's words, when it refused
};

type HoldQueue = {
  holds: QueuedHold[];
  sending: boolean;
  add: (patronId: string, hold: HoldToSend) => void;
  change: (clientId: string, changes: Partial<QueuedHold>) => void;
  remove: (clientId: string) => void;
  setSending: (sending: boolean) => void;
};

/** TODO R4a. A saved hold is checked like API data before the app trusts it (every field of QueuedHold) */
export function isQueuedHold(value: unknown): value is QueuedHold {
  throw new Error(`TODO R4a: is ${JSON.stringify(value)} a QueuedHold?`);
}

/**
 * TODO R4a. Lesson 5.5's queue (src/state/logQueue.ts is the model):
 * - add(): a new hold is 'waiting', 0 attempts, no problem; a clientId already in the queue adds nothing;
 * - wrap the store in persist(): name 'bookmobile-hold-queue', createJSONStorage(() => AsyncStorage),
 *   partialize (the holds only), merge (keep only the saved holds isQueuedHold accepts), skipHydration;
 * - loadHoldQueue() below: rehydrate.
 */
export const useHoldQueue = create<HoldQueue>()((set) => ({
  holds: [],
  sending: false,
  add: (patronId, hold) => {
    throw new Error(`TODO R4a: add ${hold.clientId} for ${patronId}`);
  },
  change: (clientId, changes) =>
    set(({ holds }) => ({
      holds: holds.map((item) => (item.clientId === clientId ? { ...item, ...changes } : item)),
    })),
  remove: (clientId) => set(({ holds }) => ({ holds: holds.filter((item) => item.clientId !== clientId) })),
  setSending: (sending) => set({ sending }),
}));

/** TODO R4a. Read the saved queue. Called once, when the app starts. */
export async function loadHoldQueue(): Promise<void> {
  throw new Error('TODO R4a: read the saved queue (persist.rehydrate)');
}
