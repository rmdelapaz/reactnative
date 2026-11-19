import { StyleSheet, View } from 'react-native';

import { SiteTile } from './SiteTile';
import type { Site } from './types';
import { useColumns } from './useColumns';

// The tiles in rows of one or two (a short last row gets an empty cell, so tiles keep the same width)
export function SiteGrid({ sites }: { sites: Site[] }) {
  const columns = useColumns();
  const rows: Site[][] = [];
  for (let start = 0; start < sites.length; start += columns) {
    rows.push(sites.slice(start, start + columns));
  }
  return (
    <View style={styles.grid}>
      {rows.map((row) => (
        <View key={row[0].id} testID="row" style={styles.row}>
          {row.map((site) => (
            <SiteTile key={site.id} site={site} />
          ))}
          {row.length < columns && <View style={styles.cell} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
  cell: { flex: 1 },
});
