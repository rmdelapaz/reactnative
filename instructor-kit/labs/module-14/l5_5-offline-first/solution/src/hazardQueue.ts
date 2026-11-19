// The hazard reports waiting to be sent: a Zustand store that saves itself on the phone, so a
// report written with no signal survives closing the app (sendReports.ts sends it later)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { HazardReport } from './types';

export type QueuedReport = {
  report: HazardReport;
  volunteerId: string; // only this volunteer's sign-in may send it
  status: 'waiting' | 'refused';
  attempts: number; // tries that got no answer
  problem: string | null; // the server's words, when it refused
};

type HazardQueue = {
  reports: QueuedReport[];
  sending: boolean;
  add: (volunteerId: string, report: HazardReport) => void;
  change: (clientId: string, changes: Partial<QueuedReport>) => void;
  remove: (clientId: string) => void;
  setSending: (sending: boolean) => void;
};

// A saved report is checked before the app trusts it: an older version may have saved another shape
function isQueuedReport(value: unknown): value is QueuedReport {
  return (
    typeof value === 'object' &&
    value !== null &&
    'volunteerId' in value &&
    typeof value.volunteerId === 'string' &&
    'status' in value &&
    (value.status === 'waiting' || value.status === 'refused') &&
    'attempts' in value &&
    typeof value.attempts === 'number' &&
    'report' in value &&
    typeof value.report === 'object' &&
    value.report !== null &&
    'clientId' in value.report &&
    typeof value.report.clientId === 'string'
  );
}

export const QUEUE_KEY = 'shoreline-lab-hazard-queue';

export const useHazardQueue = create<HazardQueue>()(
  persist(
    (set) => ({
      reports: [],
      sending: false,
      add: (volunteerId, report) =>
        set(({ reports }) =>
          reports.some((item) => item.report.clientId === report.clientId)
            ? {} // the same report twice is still one report
            : { reports: [...reports, { report, volunteerId, status: 'waiting', attempts: 0, problem: null }] },
        ),
      change: (clientId, changes) =>
        set(({ reports }) => ({
          reports: reports.map((item) =>
            item.report.clientId === clientId ? { ...item, ...changes } : item,
          ),
        })),
      remove: (clientId) =>
        set(({ reports }) => ({ reports: reports.filter((item) => item.report.clientId !== clientId) })),
      setSending: (sending) => set({ sending }),
    }),
    {
      name: QUEUE_KEY,
      // A phone has no localStorage: say where the queue lives
      storage: createJSONStorage(() => AsyncStorage),
      // Save the reports only: "sending right now" ends when the app closes
      partialize: ({ reports }) => ({ reports }),
      // Keep only the saved reports that pass the check
      merge: (saved, current) => {
        const reports =
          typeof saved === 'object' && saved !== null && 'reports' in saved ? saved.reports : [];
        return { ...current, reports: Array.isArray(reports) ? reports.filter(isQueuedReport) : [] };
      },
      // Reading AsyncStorage is async: the app loads the queue itself, behind its splash screen
      skipHydration: true,
    },
  ),
);

/** Read the saved queue back. Call it once, when the app starts. */
export function loadHazardQueue(): Promise<void> {
  return useHazardQueue.persist.rehydrate();
}
