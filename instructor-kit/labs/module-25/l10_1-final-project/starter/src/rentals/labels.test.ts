// Task 1 (do not edit): the tables and the computed values. Run from the practice copy:
//   npm test -- --watchAll=false src/rentals
import { isLate, nextSteps, rentalMinutes, rentalStatusLabels } from '@/rentals/labels';

it('Task 1: every status has its words, and cancelled is finished', () => {
  expect(rentalStatusLabels.cancelled).toBe('Cancelled');
  expect(nextSteps.booked).toContain('cancelled');
  expect(nextSteps.cancelled).toEqual([]);
});

it('Task 1: the length of a rental is computed, never stored', () => {
  expect(rentalMinutes({ start: '2030-04-02T09:00:00.000Z', end: '2030-04-02T10:30:00.000Z' })).toBe(90);
});

it('Task 1: only a kayak that is out on the water can be late', () => {
  const end = '2030-04-02T12:00:00.000Z';
  const after = new Date('2030-04-02T12:05:00.000Z');
  expect(isLate({ status: 'out', end }, after)).toBe(true);
  expect(isLate({ status: 'out', end }, new Date('2030-04-02T11:55:00.000Z'))).toBe(false);
  expect(isLate({ status: 'returned', end }, after)).toBe(false);
  expect(isLate({ status: 'booked', end }, after)).toBe(false);
});
