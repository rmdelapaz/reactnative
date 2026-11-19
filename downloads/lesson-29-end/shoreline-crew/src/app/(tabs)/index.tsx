import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { describeError } from '@/api/client';
import { sitesQuery, upcomingEventsQuery, viewerId } from '@/api/queries';
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
import { useSession } from '@/hooks/useSession';
import { createThemedStyles } from '@/hooks/useTheme';
import { layout, radius, spacing } from '@/theme/spacing';
import { getAvailability } from '@/utils/availability';
import { toDateString } from '@/utils/format';
import { matchesSearch } from '@/utils/search';
import { flattenSections, groupByWhen, type SectionRow } from '@/utils/sections';

// One item of the list: a cleanup and the beach it happens at
type Card = { event: CleanupEvent; site: Site | undefined };

// The Cleanups screen: the crew's banner and filters, then a list of the upcoming cleanups
export default function Index() {
  const session = useSession();
  // The pages of upcoming cleanups, and the beaches: two entries in the cache
  const events = useInfiniteQuery(upcomingEventsQuery(viewerId(session)));
  const sites = useQuery(sitesQuery());
  // true only while a pull to refresh (or the Refresh button) runs, not for refetches on their own
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [grouped, setGrouped] = useState(false);
  const styles = useStyles();
  // The frame (page color, safe areas) goes on a View around the list; FlashList takes the rest.
  // The tab bar covers the bottom of the screen, so the list leaves out the 'bottom' edge.
  const { style: frame, ...scroll } = useScreenScroll(['top', 'left', 'right']);
  const columns = useColumns();

  // Every cleanup loaded so far, each once: a cleanup can move to the next page while you scroll
  const loadedEvents = (events.data?.pages ?? [])
    .flatMap((page) => page.items)
    .filter((event, index, all) => all.findIndex((other) => other.id === event.id) === index);
  // The newest page knows how many cleanups there are in all
  const total = events.data?.pages.at(-1)?.page.total ?? 0;
  const loaded = events.data !== undefined && sites.data !== undefined;
  // A first load that failed and is not being tried again (a failed refresh keeps the cards)
  const trying = events.isFetching || sites.isFetching;
  const loadError = !loaded && !trying ? (events.error ?? sites.error) : null;
  // Offline, TanStack Query waits for the connection instead of failing ("paused")
  const waiting = events.fetchStatus === 'paused';

  // Each cleanup with its beach, then only the ones that pass both filters (on every render)
  const cards: Card[] = loadedEvents
    .map((event) => ({ event, site: sites.data?.find((site) => site.id === event.siteId) }))
    .filter(({ event, site }) => matchesSearch(event, site, query))
    .filter(({ event }) => !onlyOpen || getAvailability(event).kind === 'open');

  function showAll() {
    setQuery('');
    setOnlyOpen(false);
  }

  // After a failed first load: ask again for whatever is missing
  function retry() {
    if (events.isError) {
      events.refetch();
    }
    if (sites.isError) {
      sites.refetch();
    }
  }

  // Pull to refresh: the cards stay on screen while every loaded page is fetched again
  async function refresh() {
    setRefreshing(true);
    await Promise.all([events.refetch(), sites.refetch()]);
    setRefreshing(false);
  }

  // The list is near its end. Only ask when nothing is on its way and the last page did not fail:
  // after a failure, the Try again button asks (or the list would ask again and again)
  function onEndReached() {
    if (events.hasNextPage && !events.isFetching && !events.isFetchNextPageError) {
      events.fetchNextPage();
    }
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
        {loaded && <AppText variant="muted">{countLabel(cards.length, total)}</AppText>}
      </View>
      {/* A browser has no pull-to-refresh gesture, so the web preview gets a button */}
      {Platform.OS === 'web' && loaded && (
        <Button label={refreshing ? 'Refreshing…' : 'Refresh'} disabled={refreshing} onPress={refresh} />
      )}
      {/* The cards from before stay; these lines say why they did not change */}
      {loaded && waiting && (
        <AppText variant="muted" accessibilityLiveRegion="polite">
          No connection. These are the cleanups from before: they update when you are back online.
        </AppText>
      )}
      {loaded && events.isRefetchError && (
        <AppText variant="error" accessibilityRole="alert">
          {describeError(events.error)}
        </AppText>
      )}
    </View>
  );

  // What the list shows when it has no cards: still loading, a failed load, or nothing matches
  const empty =
    loadError !== null ? (
      <ErrorView message={describeError(loadError)} onRetry={retry} />
    ) : !loaded ? (
      <LoadingView label={waiting ? 'Waiting for a connection…' : 'Loading cleanups…'} />
    ) : (
      <EmptyState
        message="No cleanups match your search."
        action={{ label: 'Show all cleanups', onPress: showAll }}
      />
    );

  // Below the last card: the next page on its way, a failed page, or the end of the list
  const footer =
    events.isFetchingNextPage ? (
      <LoadingView label="Loading more cleanups…" />
    ) : events.isFetchNextPageError ? (
      <ErrorView message={describeError(events.error)} onRetry={() => events.fetchNextPage()} />
    ) : loaded && !events.hasNextPage && cards.length > 0 ? (
      <AppText variant="muted" style={styles.end}>
        That is every upcoming cleanup.
      </AppText>
    ) : undefined;

  // One list for both views: just cards, or cards under date headings (Today, Within a week, ...)
  const rows: SectionRow<Card>[] = grouped
    ? flattenSections(groupByWhen(cards, (card) => card.event.date, toDateString(new Date())))
    : cards.map((card) => ({ kind: 'item', item: card }));
  // Where the headings are in rows: FlashList keeps the current one pinned at the top
  const headingIndices = rows.flatMap((row, index) => (row.kind === 'heading' ? [index] : []));

  // target is 'StickyHeader' for the copy of a heading pinned at the top, which FlashList draws
  // across the whole list, outside its padding: that copy lines itself up with the cards
  const renderRow = ({ item: row, target }: ListRenderItemInfo<SectionRow<Card>>) =>
    row.kind === 'heading' ? (
      <View style={target === 'StickyHeader' && styles.pinned}>
        <AppText variant="heading" accessibilityRole="header" style={styles.groupTitle}>
          {row.title}
        </AppText>
      </View>
    ) : (
      <View style={styles.cell}>
        <EventCard event={row.item.event} site={row.item.site} style={styles.fill} />
      </View>
    );

  return (
    <View style={frame}>
      <FlashList
        {...scroll}
        data={rows}
        keyExtractor={(row) => (row.kind === 'heading' ? row.title : row.item.event.id)}
        renderItem={renderRow}
        // Headings and cards are recycled separately: a heading is never reused to draw a card
        getItemType={(row) => row.kind}
        numColumns={columns}
        // A heading takes the whole width; a card takes one column
        overrideItemLayout={(itemLayout, row) => {
          itemLayout.span = row.kind === 'heading' ? columns : 1;
        }}
        stickyHeaderIndices={grouped ? headingIndices : undefined}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        ListFooterComponent={footer}
        onEndReached={onEndReached}
        // Offline the refresh waits for the connection: the spinner does not need to
        refreshing={refreshing && !waiting}
        onRefresh={refresh}
        // FlashList places every cell itself, so the spacing lives in the cells (see the styles)
        contentContainerStyle={[scroll.contentContainerStyle, styles.list]}
        ListHeaderComponentStyle={styles.listHeader}
        ListEmptyComponentStyle={styles.edge}
        ListFooterComponentStyle={styles.edge}
      />
    </View>
  );
}

// "8 cleanups" when the list shows them all; "5 of 8 cleanups" while filtering, or before the last page
function countLabel(shown: number, total: number) {
  const noun = total === 1 ? 'cleanup' : 'cleanups';
  return shown === total ? `${total} ${noun}` : `${shown} of ${total} ${noun}`;
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  list: {
    gap: 0, // FlashList adds views of its own between the header and the cards: no gaps here
    paddingHorizontal: spacing.sm, // half the usual side padding: each cell adds the other half
  },
  listHeader: {
    paddingHorizontal: spacing.sm, // the other half for the header...
    paddingBottom: spacing.md,
  },
  header: {
    gap: spacing.md,
  },
  edge: {
    paddingHorizontal: spacing.sm, // ...and for the empty list and the footer
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
  pinned: {
    // The pinned copy spans the whole list: the same maximum width and edges as the cards
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: spacing.sm,
  },
  groupTitle: {
    backgroundColor: colors.page, // a sticky heading covers the cards scrolling under it
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  cell: {
    paddingHorizontal: spacing.sm, // half the gap on each side of a card
    paddingBottom: spacing.md,
  },
  end: {
    textAlign: 'center',
  },
  fill: {
    flex: 1, // the card fills its cell, so the cards in a row are as tall as the tallest
  },
}));
