import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { describeError, getEvents, getSites } from '@/api/client';
import type { CleanupEvent, Site } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { EventCard } from '@/components/EventCard';
import { Screen } from '@/components/Screen';
import { SearchField } from '@/components/SearchField';
import { SwitchRow } from '@/components/SwitchRow';
import { useColumns } from '@/hooks/useColumns';
import { createThemedStyles } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';
import { getAvailability } from '@/utils/availability';
import { toRows } from '@/utils/rows';
import { matchesSearch } from '@/utils/search';

type Load =
  | { status: 'loading' }
  | { status: 'failed'; message: string }
  | { status: 'loaded'; events: CleanupEvent[]; sites: Site[] };

// The Cleanups screen: the crew's banner, then one card per upcoming cleanup
export default function Index() {
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [query, setQuery] = useState('');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const styles = useStyles();
  const columns = useColumns();

  useEffect(() => {
    const controller = new AbortController();
    // Both requests at once: the cards need the cleanups and the beaches they happen at
    Promise.all([getEvents('when=upcoming', controller.signal), getSites(controller.signal)])
      .then(([page, sites]) => setLoad({ status: 'loaded', events: page.items, sites }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoad({ status: 'failed', message: describeError(error) });
        }
      });
    return () => controller.abort();
  }, []);

  // Each cleanup with its beach, then only the ones that pass both filters (worked out on every render)
  const cards =
    load.status === 'loaded'
      ? load.events
          .map((event) => ({ event, site: load.sites.find((site) => site.id === event.siteId) }))
          .filter(({ event, site }) => matchesSearch(event, site, query))
          .filter(({ event }) => !onlyOpen || getAvailability(event).kind === 'open')
      : [];
  // The cards in rows: one card per row on a phone, two side by side on a wider screen
  const rows = toRows(cards, columns);

  function showAll() {
    setQuery('');
    setOnlyOpen(false);
  }

  return (
    <Screen scroll>
      <View style={styles.banner}>
        <AppText variant="title" accessibilityRole="header" style={styles.bannerTitle}>
          Shoreline Crew
        </AppText>
        <AppText style={styles.bannerTagline}>Many hands, cleaner sands.</AppText>
      </View>
      <SearchField
        value={query}
        onChangeText={setQuery}
        label="Search cleanups"
        placeholder="Search by name, beach or town"
      />
      <SwitchRow label="Only cleanups with spots left" value={onlyOpen} onValueChange={setOnlyOpen} />
      {/* The heading on the left, the count pushed to the right edge */}
      <View style={styles.sectionHeader}>
        <AppText variant="heading" accessibilityRole="header" style={styles.sectionTitle}>
          Upcoming cleanups
        </AppText>
        {load.status === 'loaded' && (
          <AppText variant="muted">{countLabel(cards.length, load.events.length)}</AppText>
        )}
      </View>
      {load.status === 'loading' && <AppText variant="muted">Loading cleanups…</AppText>}
      {load.status === 'failed' && (
        <AppText variant="error" accessibilityRole="alert">
          {load.message}
        </AppText>
      )}
      {rows.map((row) => (
        <View key={row[0].event.id} style={styles.row}>
          {row.map(({ event, site }) => (
            <EventCard key={event.id} event={event} site={site} style={styles.cell} />
          ))}
          {/* A last row with one card keeps an empty cell, so the card is as wide as the others */}
          {row.length < columns && <View style={styles.cell} />}
        </View>
      ))}
      {load.status === 'loaded' && cards.length === 0 && (
        <View style={styles.empty}>
          <AppText>No cleanups match your search.</AppText>
          <Button label="Show all cleanups" variant="primary" onPress={showAll} />
        </View>
      )}
    </Screen>
  );
}

// "8 cleanups" with no filters, "3 of 8 cleanups" while filtering
function countLabel(shown: number, total: number) {
  const noun = total === 1 ? 'cleanup' : 'cleanups';
  return shown === total ? `${total} ${noun}` : `${shown} of ${total} ${noun}`;
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  banner: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.banner,
  },
  bannerTitle: {
    color: colors.onBanner,
  },
  bannerTagline: {
    color: colors.onBannerAccent,
    fontSize: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    flexShrink: 1, // with very large text, wrap instead of pushing the count off the screen
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cell: {
    flex: 1, // cards in a row share its width equally (and stretch to the tallest one)
  },
  empty: {
    gap: spacing.md,
  },
}));
