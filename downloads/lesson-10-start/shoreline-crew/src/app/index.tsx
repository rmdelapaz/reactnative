import { useEffect, useState } from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  Platform,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';

import { describeError, getEvents, getSites } from '@/api/client';
import type { CleanupEvent, Site } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ErrorView } from '@/components/ErrorView';
import { EventCard } from '@/components/EventCard';
import { LoadingView } from '@/components/LoadingView';
import { useScreenScroll } from '@/components/Screen';
import { SearchField } from '@/components/SearchField';
import { SwitchRow } from '@/components/SwitchRow';
import { useColumns } from '@/hooks/useColumns';
import { createThemedStyles } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';
import { getAvailability } from '@/utils/availability';
import { toDateString } from '@/utils/format';
import { matchesSearch } from '@/utils/search';
import { groupByWhen } from '@/utils/sections';

type Load =
  | { status: 'loading' }
  | { status: 'failed'; message: string }
  | { status: 'loaded'; events: CleanupEvent[]; sites: Site[] };

// One item of the list: a cleanup and the beach it happens at
type Card = { event: CleanupEvent; site: Site | undefined };

// The Cleanups screen: the crew's banner and filters, then a list of the upcoming cleanups
export default function Index() {
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0); // a new number loads the cleanups again
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [grouped, setGrouped] = useState(false);
  const styles = useStyles();
  const screen = useScreenScroll();
  const columns = useColumns();

  useEffect(() => {
    const controller = new AbortController();
    // Both requests at once: the cards need the cleanups and the beaches they happen at
    Promise.all([getEvents('when=upcoming', controller.signal), getSites(controller.signal)])
      .then(([page, sites]) => {
        setLoad({ status: 'loaded', events: page.items, sites });
        setRefreshing(false);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoad({ status: 'failed', message: describeError(error) });
          setRefreshing(false);
        }
      });
    return () => controller.abort();
  }, [attempt]);

  // Each cleanup with its beach, then only the ones that pass both filters (worked out on every render)
  const cards: Card[] =
    load.status === 'loaded'
      ? load.events
          .map((event) => ({ event, site: load.sites.find((site) => site.id === event.siteId) }))
          .filter(({ event, site }) => matchesSearch(event, site, query))
          .filter(({ event }) => !onlyOpen || getAvailability(event).kind === 'open')
      : [];

  function showAll() {
    setQuery('');
    setOnlyOpen(false);
  }

  // After an error: back to the spinner, then load again
  function retry() {
    setLoad({ status: 'loading' });
    setAttempt((count) => count + 1);
  }

  // Pull to refresh: the cards stay on screen while the list loads again
  function refresh() {
    setRefreshing(true);
    setAttempt((count) => count + 1);
  }

  // Everything above the cards. An element, not a component: the search field keeps its focus.
  const header = (
    <View style={styles.header}>
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
      <SwitchRow label="Group by date" value={grouped} onValueChange={setGrouped} />
      {/* The heading on the left, the count pushed to the right edge */}
      <View style={styles.sectionHeader}>
        <AppText variant="heading" accessibilityRole="header" style={styles.sectionTitle}>
          Upcoming cleanups
        </AppText>
        {load.status === 'loaded' && (
          <AppText variant="muted">{countLabel(cards.length, load.events.length)}</AppText>
        )}
      </View>
      {/* A browser has no pull-to-refresh gesture, so the web preview gets a button */}
      {Platform.OS === 'web' && load.status === 'loaded' && (
        <Button label={refreshing ? 'Refreshing…' : 'Refresh'} disabled={refreshing} onPress={refresh} />
      )}
    </View>
  );

  // What the list shows when it has no cards: still loading, a failed load, or nothing matches
  const empty =
    load.status === 'loading' ? (
      <LoadingView label="Loading cleanups…" />
    ) : load.status === 'failed' ? (
      <ErrorView message={load.message} onRetry={retry} />
    ) : (
      <EmptyState
        message="No cleanups match your search."
        action={{ label: 'Show all cleanups', onPress: showAll }}
      />
    );

  if (grouped) {
    // The same cards under headings: Today, Within a week, Within a month, Later
    const sections = groupByWhen(cards, (card) => card.event.date, toDateString(new Date()));
    return (
      <SectionList
        {...screen}
        sections={sections}
        keyExtractor={(card) => card.event.id}
        renderItem={({ item }) => <EventCard event={item.event} site={item.site} />}
        renderSectionHeader={({ section }) => (
          <AppText variant="heading" accessibilityRole="header" style={styles.groupTitle}>
            {section.title}
          </AppText>
        )}
        stickySectionHeadersEnabled // the heading stays at the top while its cards scroll under it
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        refreshing={refreshing}
        onRefresh={refresh}
      />
    );
  }

  // Several columns: each card gets an equal share of its row (100% on a phone, 50% when wider),
  // and the cells' padding makes the gap between cards
  const grid = columns > 1;
  const cellWidth = `${100 / columns}%`;
  const renderCard = ({ item }: ListRenderItemInfo<Card>) => (
    <View style={[{ width: cellWidth }, grid && styles.cell]}>
      <EventCard event={item.event} site={item.site} style={styles.fill} />
    </View>
  );

  return (
    <FlatList
      {...screen}
      // A FlatList cannot change its number of columns: a new key makes React build a new one
      key={columns}
      data={cards}
      keyExtractor={(card) => card.event.id}
      renderItem={renderCard}
      numColumns={columns}
      columnWrapperStyle={grid ? styles.row : undefined}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      refreshing={refreshing}
      onRefresh={refresh}
    />
  );
}

// "8 cleanups" with no filters, "3 of 8 cleanups" while filtering
function countLabel(shown: number, total: number) {
  const noun = total === 1 ? 'cleanup' : 'cleanups';
  return shown === total ? `${total} ${noun}` : `${shown} of ${total} ${noun}`;
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  header: {
    gap: spacing.md,
  },
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
  groupTitle: {
    backgroundColor: colors.page, // a sticky heading covers the cards scrolling under it
    paddingVertical: spacing.xs,
  },
  row: {
    marginHorizontal: -spacing.sm, // the outer cells' padding lines up with the header's edges
  },
  cell: {
    paddingHorizontal: spacing.sm, // half the gap on each side of a card
  },
  fill: {
    flex: 1, // the card fills its cell, so the cards in a row are as tall as the tallest
  },
}));
