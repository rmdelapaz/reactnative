import type { Stop, TimeString, Weekday } from '@/api/types';

const dayNames: Record<Weekday, string> = {
  monday: 'Mondays',
  tuesday: 'Tuesdays',
  wednesday: 'Wednesdays',
  thursday: 'Thursdays',
  friday: 'Fridays',
  saturday: 'Saturdays',
};

/** '14:30' -> '2:30 PM' */
export function timeLabel(time: TimeString): string {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  const suffix = hours < 12 ? 'AM' : 'PM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

/** When the van is there: 'Mondays, 10:00 AM to 11:30 AM' */
export function scheduleLabel(stop: Stop): string {
  return `${dayNames[stop.day]}, ${timeLabel(stop.start)} to ${timeLabel(stop.end)}`;
}
