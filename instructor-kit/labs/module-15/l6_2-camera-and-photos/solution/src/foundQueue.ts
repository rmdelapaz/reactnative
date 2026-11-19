// The found items waiting to be sent, each with its photos: a Zustand store saved on the phone
// (Lesson 5.5's queue). Version 1 added the photos: items saved by version 0 get an empty list.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { FoundItem, ItemPhoto } from './types';

export type QueuedItem = {
  item: FoundItem;
  photos: ItemPhoto[]; // uploaded before the item, which then lists their ids
  status: 'waiting' | 'refused';
  attempts: number; // tries that got no answer
  problem: string | null; // the server's words, when it refused
};

type FoundQueue = {
  items: QueuedItem[];
  sending: boolean;
  add: (item: FoundItem, photos: ItemPhoto[]) => void;
  change: (clientId: string, changes: Partial<QueuedItem>) => void;
  setPhotoId: (clientId: string, uri: string, photoId: string) => void;
  remove: (clientId: string) => void;
  setSending: (sending: boolean) => void;
};

function isItemPhoto(value: unknown): value is ItemPhoto {
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

// A saved item is checked before the app trusts it
function isQueuedItem(value: unknown): value is QueuedItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    (value.status === 'waiting' || value.status === 'refused') &&
    'attempts' in value &&
    typeof value.attempts === 'number' &&
    'photos' in value &&
    Array.isArray(value.photos) &&
    value.photos.every(isItemPhoto) &&
    'item' in value &&
    typeof value.item === 'object' &&
    value.item !== null &&
    'clientId' in value.item &&
    typeof value.item.clientId === 'string'
  );
}

export const QUEUE_KEY = 'shoreline-lab-found-queue';

export const useFoundQueue = create<FoundQueue>()(
  persist(
    (set) => ({
      items: [],
      sending: false,
      add: (item, photos) =>
        set(({ items }) => ({
          items: [...items, { item, photos, status: 'waiting', attempts: 0, problem: null }],
        })),
      change: (clientId, changes) =>
        set(({ items }) => ({
          items: items.map((queued) =>
            queued.item.clientId === clientId ? { ...queued, ...changes } : queued,
          ),
        })),
      setPhotoId: (clientId, uri, photoId) =>
        set(({ items }) => ({
          items: items.map((queued) =>
            queued.item.clientId === clientId
              ? {
                  ...queued,
                  photos: queued.photos.map((photo) =>
                    photo.uri === uri ? { ...photo, photoId } : photo,
                  ),
                }
              : queued,
          ),
        })),
      remove: (clientId) =>
        set(({ items }) => ({ items: items.filter((queued) => queued.item.clientId !== clientId) })),
      setSending: (sending) => set({ sending }),
    }),
    {
      name: QUEUE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ items }) => ({ items }),
      // Version 1 added photos. persist calls migrate when the saved version is older
      version: 1,
      migrate: (saved, version) => {
        const items = typeof saved === 'object' && saved !== null && 'items' in saved ? saved.items : [];
        return {
          items: (Array.isArray(items) ? items : [])
            .map((queued) => (version === 0 ? { ...queued, photos: [] } : queued))
            .filter(isQueuedItem),
        };
      },
      // Keep only the saved items that pass the check
      merge: (saved, current) => {
        const items =
          typeof saved === 'object' && saved !== null && 'items' in saved && Array.isArray(saved.items)
            ? saved.items.filter(isQueuedItem)
            : [];
        return { ...current, items };
      },
      skipHydration: true, // read back behind the splash screen in the app: loadFoundQueue()
    },
  ),
);

/** Read the saved queue back (the app does this behind its splash screen) */
export async function loadFoundQueue(): Promise<void> {
  await useFoundQueue.persist.rehydrate();
}
