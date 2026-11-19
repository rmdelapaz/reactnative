// Sample data for tests (the HQ's idea): complete, correctly typed objects. A test passes only
// the parts it is about.
import type { Session } from '@/api/client';
import type { LogToSend } from '@/api/schemas';
import type { CleanupEvent } from '@/api/types';

/** Today's cleanup in the sample data (e17), where Theo has a spot */
export function makeEvent(changes: Partial<CleanupEvent> = {}): CleanupEvent {
  return {
    id: 'e17',
    title: 'Tide Pool Morning Cleanup',
    siteId: 'otter-creek',
    status: 'scheduled',
    date: '2026-07-04',
    startTime: '08:00',
    endTime: '10:30',
    capacity: 12,
    spotsTaken: 5,
    meetingPoint: 'Gravel pull-out on Highway 1',
    description: 'We clear trash caught in the willows and along the creek banks. Expect mud.',
    suppliesProvided: ['gloves', 'bags'],
    leadOrganizerId: 'v03',
    createdAt: '2026-06-01T16:00:00.000Z',
    updatedAt: '2026-06-01T16:00:00.000Z',
    ...changes,
  };
}

/** A debris log for a cleanup, as the log form hands it to the queue */
export function makeLogToSend(clientId: string, event = makeEvent()): LogToSend {
  return {
    event,
    log: {
      clientId,
      items: [{ category: 'plastic-bottles', count: 12 }],
      bags: 2,
      weightKg: 3.5,
      note: '',
      recordedAt: '2026-07-04T17:30:00.000Z',
    },
  };
}

/** Theo, signed in as a volunteer (dev-volunteer: a token the API accepts without signing in) */
export const volunteer: Session = {
  token: 'dev-volunteer',
  user: { id: 'v04', name: 'Theo Nakamura', email: 'theo.nakamura@example.com', role: 'volunteer' },
};
