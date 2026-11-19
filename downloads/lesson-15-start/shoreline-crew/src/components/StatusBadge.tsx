import type { EventStatus } from '@/api/types';
import { Badge, type BadgeTone } from '@/components/Badge';

// One entry per status: TypeScript reports a missing or misspelled one.
const statusBadges: Record<EventStatus, { label: string; tone: BadgeTone }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  scheduled: { label: 'Scheduled', tone: 'info' },
  completed: { label: 'Completed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
};

type StatusBadgeProps = {
  status: EventStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, tone } = statusBadges[status];
  return <Badge label={label} tone={tone} />;
}
