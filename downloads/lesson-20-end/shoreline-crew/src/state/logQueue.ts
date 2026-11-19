// The debris logs waiting to be sent (new): a Zustand store that saves itself on the phone with
// AsyncStorage, so a log finished with no signal survives closing the app (src/state/sendLogs.ts
// sends it later). Lesson 5.3's settings store saves by hand; Zustand's persist does it for us.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { isCleanupEvent } from '@/api/client';
import type { LogToSend } from '@/api/schemas';

/** 'waiting': not on the server yet. 'refused': the server said no, and would say it again. */
export type QueuedLogStatus = 'waiting' | 'refused';

/** One log in the queue: what to send, whose it is, and how sending it has gone so far */
export type QueuedLog = LogToSend & {
  volunteerId: string; // the volunteer who wrote it: only their sign-in may send it
  status: QueuedLogStatus;
  attempts: number; // tries that got no answer (no connection, server trouble)
  problem: string | null; // the server's words, when it refused
};

type LogQueue = {
  logs: QueuedLog[];
  sending: boolean;
  add: (volunteerId: string, item: LogToSend) => void;
  change: (clientId: string, changes: Partial<QueuedLog>) => void;
  remove: (clientId: string) => void;
  setSending: (sending: boolean) => void;
};

// A saved log is checked like API data before the app trusts it: an older version of the app
// (or a bug) may have written something else
function isQueuedLog(value: unknown): value is QueuedLog {
  return (
    typeof value === 'object' &&
    value !== null &&
    'volunteerId' in value &&
    typeof value.volunteerId === 'string' &&
    'status' in value &&
    (value.status === 'waiting' || value.status === 'refused') &&
    'attempts' in value &&
    typeof value.attempts === 'number' &&
    'event' in value &&
    isCleanupEvent(value.event) &&
    'log' in value &&
    typeof value.log === 'object' &&
    value.log !== null &&
    'clientId' in value.log &&
    typeof value.log.clientId === 'string'
  );
}

export const useLogQueue = create<LogQueue>()(
  persist(
    (set) => ({
      logs: [],
      sending: false,
      add: (volunteerId, item) =>
        set(({ logs }) => {
          if (logs.some(({ log }) => log.clientId === item.log.clientId)) {
            return {}; // the same log twice (same clientId) is still one log
          }
          const queued: QueuedLog = {
            ...item,
            volunteerId,
            status: 'waiting',
            attempts: 0,
            problem: null,
          };
          return { logs: [...logs, queued] };
        }),
      change: (clientId, changes) =>
        set(({ logs }) => ({
          logs: logs.map((item) =>
            item.log.clientId === clientId ? { ...item, ...changes } : item,
          ),
        })),
      remove: (clientId) =>
        set(({ logs }) => ({ logs: logs.filter(({ log }) => log.clientId !== clientId) })),
      setSending: (sending) => set({ sending }),
    }),
    {
      name: 'shoreline-crew-log-queue',
      // A phone has no localStorage: tell persist where to keep the queue
      storage: createJSONStorage(() => AsyncStorage),
      // Save the logs only. "Sending right now" ends when the app closes
      partialize: ({ logs }) => ({ logs }),
      // Keep only the saved logs that pass the check
      merge: (saved, current) => {
        const logs =
          typeof saved === 'object' && saved !== null && 'logs' in saved ? saved.logs : [];
        return { ...current, logs: Array.isArray(logs) ? logs.filter(isQueuedLog) : [] };
      },
      // Reading AsyncStorage is async: the root layout loads the queue behind the splash screen
      skipHydration: true,
    },
  ),
);

/** Read the saved queue. Call it once, when the app starts. */
export function loadLogQueue(): Promise<void> {
  return useLogQueue.persist.rehydrate();
}
