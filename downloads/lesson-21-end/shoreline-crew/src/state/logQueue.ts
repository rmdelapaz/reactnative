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

/** A photo for a log: the file on this phone, its kind, and its id on the server once uploaded */
export type LogPhoto = {
  uri: string;
  type: string; // 'image/jpeg', 'image/png' or 'image/webp': what the API takes
  photoId: string | null; // null until the upload worked
};

/** One log in the queue: what to send, whose it is, and how sending it has gone so far */
export type QueuedLog = LogToSend & {
  photos: LogPhoto[]; // sent before the log, which then lists their ids
  volunteerId: string; // the volunteer who wrote it: only their sign-in may send it
  status: QueuedLogStatus;
  attempts: number; // tries that got no answer (no connection, server trouble)
  problem: string | null; // the server's words, when it refused
};

type LogQueue = {
  logs: QueuedLog[];
  sending: boolean;
  add: (volunteerId: string, item: LogToSend, photos: LogPhoto[]) => void;
  change: (clientId: string, changes: Partial<QueuedLog>) => void;
  setPhotoId: (clientId: string, uri: string, photoId: string) => void;
  remove: (clientId: string) => void;
  setSending: (sending: boolean) => void;
};

function isLogPhoto(value: unknown): value is LogPhoto {
  return (
    typeof value === 'object' &&
    value !== null &&
    'uri' in value &&
    typeof value.uri === 'string' &&
    'type' in value &&
    typeof value.type === 'string' &&
    'photoId' in value &&
    (value.photoId === null || typeof value.photoId === 'string')
  );
}

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
    'photos' in value &&
    Array.isArray(value.photos) &&
    value.photos.every(isLogPhoto) &&
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
      add: (volunteerId, item, photos) =>
        set(({ logs }) => {
          if (logs.some(({ log }) => log.clientId === item.log.clientId)) {
            return {}; // the same log twice (same clientId) is still one log
          }
          const queued: QueuedLog = {
            ...item,
            photos,
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
      setPhotoId: (clientId, uri, photoId) =>
        set(({ logs }) => ({
          logs: logs.map((item) =>
            item.log.clientId === clientId
              ? {
                  ...item,
                  photos: item.photos.map((photo) =>
                    photo.uri === uri ? { ...photo, photoId } : photo,
                  ),
                }
              : item,
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
      // Version 1 (Lesson 6.2) added photos. persist calls migrate when the saved version is older:
      // a log saved by version 0 gets an empty photo list, so it passes the check and is kept
      version: 1,
      migrate: (saved, version) => {
        const logs = typeof saved === 'object' && saved !== null && 'logs' in saved ? saved.logs : [];
        return {
          logs: (Array.isArray(logs) ? logs : [])
            .map((item) => (version === 0 ? { ...item, photos: [] } : item))
            .filter(isQueuedLog),
        };
      },
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
