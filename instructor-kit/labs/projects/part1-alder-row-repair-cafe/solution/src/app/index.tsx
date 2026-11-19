import { useState } from 'react';
import { FlatList, type ListRenderItemInfo, SectionList, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { EmptyState } from '../components/EmptyState';
import { useScreenScroll } from '../components/Screen';
import { SearchField } from '../components/SearchField';
import { SwitchRow } from '../components/SwitchRow';
import { TicketCard } from '../components/TicketCard';
import { tickets as todaysTickets } from '../data/tickets';
import { useColumns } from '../hooks/useColumns';
import { createThemedStyles } from '../hooks/useTheme';
import { radius, spacing } from '../theme/spacing';
import type { Ticket } from '../types';
import { countLabel, filterTickets, groupByCategory } from '../utils/tickets';

// The repair queue: the café's banner and filters, then today's tickets in one or two columns, or under
// their tables
export default function Queue() {
  const [tickets, setTickets] = useState<Ticket[]>(todaysTickets);
  const [query, setQuery] = useState('');
  const [hideFinished, setHideFinished] = useState(false);
  const [grouped, setGrouped] = useState(false);
  const screen = useScreenScroll();
  const columns = useColumns();
  const styles = useStyles();

  // Derived on every render from the state above: never stored
  const shown = filterTickets(tickets, query, hideFinished);

  // A fixer finished a repair: a NEW array with a NEW ticket in it, so React sees the change
  function markFixed(id: string) {
    setTickets((current) => current.map((t): Ticket => (t.id === id ? { ...t, status: 'fixed' } : t)));
  }

  function showAll() {
    setQuery('');
    setHideFinished(false);
  }

  // Everything above the tickets. An element, not a component: the search field keeps its focus.
  const header = (
    <View style={styles.header}>
      <View style={styles.banner}>
        <AppText variant="title" accessibilityRole="header">
          Fix-It Tables
        </AppText>
        <AppText style={styles.bannerSub}>Alder Row Repair Café</AppText>
      </View>
      <SearchField value={query} onChangeText={setQuery} label="Search repairs" placeholder="Item or name" />
      <SwitchRow label="Hide finished repairs" value={hideFinished} onValueChange={setHideFinished} />
      <SwitchRow label="Group by table" value={grouped} onValueChange={setGrouped} />
      <View style={styles.countRow}>
        <AppText variant="heading" accessibilityRole="header" style={styles.countTitle}>
          Today&apos;s repairs
        </AppText>
        <AppText variant="muted">{countLabel(shown.length, tickets.length)}</AppText>
      </View>
    </View>
  );
  const empty = (
    <EmptyState message="No repairs match your search." action={{ label: 'Show all repairs', onPress: showAll }} />
  );

  if (grouped) {
    return (
      <SectionList
        {...screen}
        sections={groupByCategory(shown)}
        keyExtractor={(ticket) => ticket.id}
        renderItem={({ item }) => <TicketCard ticket={item} onMarkFixed={markFixed} />}
        renderSectionHeader={({ section }) => (
          <AppText variant="heading" accessibilityRole="header" style={styles.table}>
            {section.title}
          </AppText>
        )}
        stickySectionHeadersEnabled // the table's name stays on top while its tickets scroll under it
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
      />
    );
  }

  // Two columns: each cell is half the row, and the cells' padding makes the gap between cards
  const grid = columns > 1;
  const renderTicket = ({ item }: ListRenderItemInfo<Ticket>) => (
    <View style={[{ width: `${100 / columns}%` }, grid && styles.cell]}>
      <TicketCard ticket={item} onMarkFixed={markFixed} style={styles.fill} />
    </View>
  );
  return (
    <FlatList
      {...screen}
      key={columns} // a FlatList cannot change its number of columns: a new key builds a new one
      data={shown}
      keyExtractor={(ticket) => ticket.id}
      renderItem={renderTicket}
      numColumns={columns}
      columnWrapperStyle={grid ? styles.row : undefined}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
    />
  );
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  header: { gap: spacing.md },
  banner: { gap: spacing.xs, padding: spacing.md, borderRadius: radius.card, backgroundColor: colors.banner },
  bannerSub: { color: colors.onBannerAccent },
  countRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: spacing.sm },
  countTitle: { flexShrink: 1 },
  table: { backgroundColor: colors.page, paddingVertical: spacing.xs }, // a sticky heading covers the cards
  row: { marginHorizontal: -spacing.sm },
  cell: { paddingHorizontal: spacing.sm },
  fill: { flex: 1 },
}));
