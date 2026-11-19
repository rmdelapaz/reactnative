import type { DateString } from '@/api/types';

// Made once, used for every date: weekday, month name, day and year
const dateFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

// The API's dates are days on the crew's calendar ("YYYY-MM-DD"). JavaScript reads a date
// alone as midnight UTC, which is still the day before on the US west coast; with a time
// and no time zone it reads the local midnight instead.
export function formatDate(date: DateString): string {
  return dateFormat.format(new Date(`${date}T00:00`));
}

// Today (or any moment) as a "YYYY-MM-DD" day on this device's calendar
export function toDateString(date: Date): DateString {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
