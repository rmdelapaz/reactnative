// The holds waiting to be sent (Lesson 5.5): a Zustand store that saves itself on the phone with
// AsyncStorage, so a hold placed with one bar of signal survives closing the app.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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

const textFields = ['clientId', 'bookId', 'bookTitle', 'stopId', 'stopName', 'note', 'patronId'] as const;

/** TODO R4a (done). A saved hold is checked like API data before the app trusts it */
export function isQueuedHold(value: unknown): value is QueuedHold {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const item = value as Record<string, unknown>;
  return (
    textFields.every((key) => typeof item[key] === 'string') &&
    (item.status === 'waiting' || item.status === 'refused') &&
    typeof item.attempts === 'number' &&
    (item.problem === null || typeof item.problem === 'string')
  );
}

export const useHoldQueue = create<HoldQueue>()(
  persist(
    (set) => ({
      holds: [],
      sending: false,
      add: (patronId, hold) =>
        set(({ holds }) => {
          if (holds.some((item) => item.clientId === hold.clientId)) {
            return {}; // the same hold twice (same clientId) is still one hold
          }
          return { holds: [...holds, { ...hold, patronId, status: 'waiting', attempts: 0, problem: null }] };
        }),
      change: (clientId, changes) =>
        set(({ holds }) => ({
          holds: holds.map((item) => (item.clientId === clientId ? { ...item, ...changes } : item)),
        })),
      remove: (clientId) => set(({ holds }) => ({ holds: holds.filter((item) => item.clientId !== clientId) })),
      setSending: (sending) => set({ sending }),
    }),
    {
      name: 'bookmobile-hold-queue',
      // A phone has no localStorage: tell persist where to keep the queue
      storage: createJSONStorage(() => AsyncStorage),
      // Save the holds only: "sending right now" ends when the app closes
      partialize: ({ holds }) => ({ holds }),
      // Keep only the saved holds that pass the check
      merge: (saved, current) => {
        const holds = typeof saved === 'object' && saved !== null && 'holds' in saved ? saved.holds : [];
        return { ...current, holds: Array.isArray(holds) ? holds.filter(isQueuedHold) : [] };
      },
      // Reading AsyncStorage is async: the root layout loads the queue behind the splash screen
      skipHydration: true,
    },
  ),
);

/** Read the saved queue. Call it once, when the app starts. */
export function loadHoldQueue(): Promise<void> {
  return useHoldQueue.persist.rehydrate();
}
