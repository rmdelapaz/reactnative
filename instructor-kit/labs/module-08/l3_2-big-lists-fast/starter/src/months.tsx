import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { StyleSheet, Text } from 'react-native';

import { CleanupRow } from './CleanupRow';
import type { PastCleanup } from './types';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December'] as const;
export type Month = (typeof monthNames)[number];

// "2026-05-15" -> "May" (the month is in the string: no time zones involved)
export function monthOf(date: string): Month {
  return monthNames[Number(date.slice(5, 7)) - 1];
}

// One row of the flat list: a month heading, or a cleanup under it
export type MonthRow = { kind: 'heading'; title: Month } | { kind: 'item'; cleanup: PastCleanup };

// The cleanups (in date order) as one array: each month's heading, then that month's cleanups
export function flattenByMonth(cleanups: PastCleanup[]): MonthRow[] {
  throw new Error(`TODO 3: headings and rows for ${cleanups.length} cleanups`);
}

// Where the headings are: the positions FlashList pins at the top
export function headingIndices(rows: MonthRow[]): number[] {
  throw new Error(`TODO 3: the positions of the headings among ${rows.length} rows`);
}

// The past cleanups under month headings, in ONE FlashList
export function PastList({ cleanups }: { cleanups: PastCleanup[] }) {
  const rows = flattenByMonth(cleanups);
  const renderRow = ({ item: row }: ListRenderItemInfo<MonthRow>) =>
    row.kind === 'heading' ? (
      <Text accessibilityRole="header" style={styles.month}>
        {row.title}
      </Text>
    ) : (
      <CleanupRow cleanup={row.cleanup} />
    );
  // TODO 3: headings and cleanups recycled in separate pools, and the headings pinned
  return (
    <FlashList
      data={rows}
      keyExtractor={(row) => (row.kind === 'heading' ? row.title : row.cleanup.id)}
      renderItem={renderRow}
    />
  );
}

const styles = StyleSheet.create({
  month: { backgroundColor: '#fbf6ec', fontSize: 20, fontWeight: '700', paddingVertical: 4 },
});
