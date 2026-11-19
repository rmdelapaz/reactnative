import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { describeError, getEvents, getSites } from '@/api/client';
import type { CleanupEvent, Site } from '@/api/types';
import { AppText } from '@/components/AppText';
import { EventCard } from '@/components/EventCard';
import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

type Load =
  | { status: 'loading' }
  | { status: 'failed'; message: string }
  | { status: 'loaded'; events: CleanupEvent[]; sites: Site[] };

// The Cleanups screen: the crew's banner, then one card per upcoming cleanup
export default function Index() {
  const [load, setLoad] = useState<Load>({ status: 'loading' });

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

  return (
    <Screen scroll>
      <View style={styles.banner}>
        <AppText variant="title" accessibilityRole="header" style={styles.bannerTitle}>
          Shoreline Crew
        </AppText>
        <AppText style={styles.bannerTagline}>Many hands, cleaner sands.</AppText>
      </View>
      {/* The heading on the left, the count pushed to the right edge */}
      <View style={styles.sectionHeader}>
        <AppText variant="heading" accessibilityRole="header" style={styles.sectionTitle}>
          Upcoming cleanups
        </AppText>
        {load.status === 'loaded' && (
          <AppText variant="muted">
            {load.events.length} {load.events.length === 1 ? 'cleanup' : 'cleanups'}
          </AppText>
        )}
      </View>
      {load.status === 'loading' && <AppText variant="muted">Loading cleanups…</AppText>}
      {load.status === 'failed' && (
        <AppText variant="error" accessibilityRole="alert">
          {load.message}
        </AppText>
      )}
      {load.status === 'loaded' &&
        load.events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            site={load.sites.find((site) => site.id === event.siteId)}
          />
        ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
});
