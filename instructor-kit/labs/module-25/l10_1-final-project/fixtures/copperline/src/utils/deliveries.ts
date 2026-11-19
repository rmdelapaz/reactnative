import type { DeliveryStatus } from '@/api/types';

// Words for each status, for the run sheet and for screen readers
export const deliveryStatusLabels: Record<DeliveryStatus, string> = {
  assigned: 'Assigned',
  'picked-up': 'Picked up',
  delivered: 'Delivered',
  failed: 'Failed',
};

// The only moves a delivery can make: the mock API refuses anything else (409), and the screen
// offers only these buttons. A Record, so a new status cannot be forgotten here.
export const nextSteps: Record<DeliveryStatus, readonly DeliveryStatus[]> = {
  assigned: ['picked-up'],
  'picked-up': ['delivered', 'failed'],
  delivered: [],
  failed: [],
};

export function isDeliveryStatus(value: unknown): value is DeliveryStatus {
  return typeof value === 'string' && Object.hasOwn(deliveryStatusLabels, value);
}
