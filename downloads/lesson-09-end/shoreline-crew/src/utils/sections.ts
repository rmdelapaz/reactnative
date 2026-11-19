import type { DateString } from '@/api/types';

// The headings of the grouped list, the nearest first
export const whenGroups = ['Today', 'Within a week', 'Within a month', 'Later'] as const;
export type WhenGroup = (typeof whenGroups)[number];

// One heading and the items under it: the shape SectionList wants
export type Section<T> = { title: WhenGroup; data: T[] };

// Whole days from today to a date, both "YYYY-MM-DD": 0 is today, 3 is three days away.
// A date alone is read as midnight UTC; both are, so the difference is whole days.
export function daysFrom(today: DateString, date: DateString): number {
  return Math.round((Date.parse(date) - Date.parse(today)) / 86_400_000);
}

export function whenGroup(days: number): WhenGroup {
  if (days <= 0) {
    return 'Today';
  }
  if (days <= 7) {
    return 'Within a week';
  }
  if (days <= 30) {
    return 'Within a month';
  }
  return 'Later';
}

// The items in sections, nearest first, leaving out headings with nothing under them
export function groupByWhen<T>(
  items: T[],
  dateOf: (item: T) => DateString,
  today: DateString,
): Section<T>[] {
  return whenGroups
    .map((title) => ({
      title,
      data: items.filter((item) => whenGroup(daysFrom(today, dateOf(item))) === title),
    }))
    .filter((section) => section.data.length > 0);
}
