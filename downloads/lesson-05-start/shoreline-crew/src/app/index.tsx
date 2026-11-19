import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { describeError, getEvents } from '@/api/client';
import type { CleanupEvent } from '@/api/types';
import { AppText } from '@/components/AppText';
import { EventCard } from '@/components/EventCard';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

type Load =
  | { status: 'loading' }
  | { status: 'failed'; message: string }
  | { status: 'loaded'; events: CleanupEvent[] };

// The Cleanups screen: the crew's banner, then one card per upcoming cleanup
export default function Index() {
  const [load, setLoad] = useState<Load>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    getEvents('when=upcoming', controller.signal)
      .then((page) => setLoad({ status: 'loaded', events: page.items }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoad({ status: 'failed', message: describeError(error) });
        }
      });
    return () => controller.abort();
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.banner}>
        <AppText variant="title" accessibilityRole="header" style={styles.bannerTitle}>
          Shoreline Crew
        </AppText>
        <AppText style={styles.bannerTagline}>Many hands, cleaner sands.</AppText>
      </View>
      <AppText variant="heading" accessibilityRole="header">
        Upcoming cleanups
      </AppText>
      {load.status === 'loading' && <AppText variant="muted">Loading cleanups…</AppText>}
      {load.status === 'failed' && (
        <AppText variant="error" accessibilityRole="alert">
          {load.message}
        </AppText>
      )}
      {load.status === 'loaded' &&
        load.events.map((event) => <EventCard key={event.id} event={event} />)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.page,
  },
  content: {
    gap: spacing.md,
    padding: spacing.md,
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
});
