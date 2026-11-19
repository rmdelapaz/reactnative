import { Image } from 'expo-image';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';

import { ApiError, describeError, getEvent } from '@/api/client';
import type { CleanupEventDetail, Terrain } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Detail } from '@/components/Detail';
import { EmptyState } from '@/components/EmptyState';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { StatusBadge } from '@/components/StatusBadge';
import { createThemedStyles } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';
import { getAvailability } from '@/utils/availability';
import { formatDate, toDateString } from '@/utils/format';
import { cleanupLink, cleanupMessage } from '@/utils/links';

type Load =
  | { status: 'loading' }
  | { status: 'missing'; message: string } // the API has no cleanup with this id (404)
  | { status: 'failed'; message: string }
  | { status: 'loaded'; event: CleanupEventDetail };

// How the beach is underfoot, in words
const terrainWords: Record<Terrain, string> = {
  sand: 'Sand',
  rocky: 'Rocks',
  marsh: 'Marsh',
  mixed: 'Sand and rocks',
};

// One cleanup on a screen of its own: /cleanups/e08 shows the cleanup with the id e08
export default function CleanupScreen() {
  // The [id] part of the address. Always a string: it comes from the address, like a URL's path.
  const { id } = useLocalSearchParams<'/cleanups/[id]'>();
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  // The link to copy, when this device has no share sheet to send it with
  const [linkToCopy, setLinkToCopy] = useState<string | null>(null);
  const styles = useStyles();

  useEffect(() => {
    const controller = new AbortController();
    getEvent(id, controller.signal)
      .then((event) => setLoad({ status: 'loaded', event }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        const missing = error instanceof ApiError && error.status === 404;
        setLoad({ status: missing ? 'missing' : 'failed', message: describeError(error) });
      });
    return () => controller.abort();
  }, [id, attempt]);

  function retry() {
    setLoad({ status: 'loading' });
    setAttempt((count) => count + 1);
  }

  // Back where the volunteer came from; opened from a link, there may be nothing to go back to
  function leave() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  if (load.status !== 'loaded') {
    return (
      // A header bar covers the top of the screen, so the screen leaves out the 'top' edge
      <Screen edges={['bottom', 'left', 'right']}>
        {load.status === 'loading' && <LoadingView label="Loading the cleanup…" />}
        {load.status === 'failed' && <ErrorView message={load.message} onRetry={retry} />}
        {load.status === 'missing' && (
          <EmptyState message={load.message} action={{ label: 'Back to the cleanups', onPress: leave }} />
        )}
      </Screen>
    );
  }

  const { event } = load;
  const { site } = event;
  const availability = getAvailability(event);

  // The phone's share sheet, with a message and a link that opens this screen
  async function share() {
    const link = cleanupLink(event.id);
    try {
      // Android shares the title and the message only, so the link goes inside the message
      await Share.share({ title: event.title, message: cleanupMessage(event, link) });
    } catch {
      // No share sheet here (the web preview in most desktop browsers): show the link instead
      setLinkToCopy(link);
    }
  }

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      {/* Options for this screen, set from inside it: the header bar shows the cleanup's name */}
      <Stack.Screen options={{ title: event.title }} />
      <Image
        source={site.image.url}
        accessible
        accessibilityLabel={site.image.alt}
        style={[styles.picture, { aspectRatio: site.image.width / site.image.height }]}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.badges}>
        <StatusBadge status={event.status} />
        {event.date === toDateString(new Date()) && <Badge label="Today" tone="attention" />}
      </View>
      <View style={styles.details}>
        <Detail icon="date" label="When">
          {formatDate(event.date)}, {event.startTime} to {event.endTime}
        </Detail>
        <Detail icon="place" label="Where">
          {site.name}, {site.town}
        </Detail>
        <Detail icon="meet" label="Meet at">
          {event.meetingPoint}
        </Detail>
      </View>
      {availability.kind === 'open' && (
        <AppText>
          <Text style={styles.strong}>{availability.spotsLeft}</Text> of {event.capacity} spots left
        </AppText>
      )}
      {availability.kind === 'full' && (
        <AppText style={styles.strong}>Full: new sign-ups join the waiting list</AppText>
      )}
      <Button label="Share this cleanup" onPress={share} />
      {linkToCopy !== null && (
        <AppText selectable accessibilityLiveRegion="polite">
          Sharing is not available here. Copy this link instead: {linkToCopy}
        </AppText>
      )}
      <AppText variant="heading" accessibilityRole="header">
        About this cleanup
      </AppText>
      <AppText>{event.description}</AppText>
      {event.suppliesProvided.length > 0 && (
        <AppText variant="muted">We bring: {event.suppliesProvided.join(', ')}</AppText>
      )}
      {/* The safety briefing opens as a modal over this screen */}
      <Link href="/before-you-go" asChild>
        <Button label="Before you go" />
      </Link>
      <AppText variant="heading" accessibilityRole="header">
        The beach
      </AppText>
      <AppText>{site.description}</AppText>
      <AppText>
        <Text style={styles.strong}>Underfoot: </Text>
        {terrainWords[site.terrain]}
        {site.accessible ? ', with a step-free route to the meeting point' : ''}
      </AppText>
      <AppText>
        <Text style={styles.strong}>Parking: </Text>
        {site.parking}
      </AppText>
    </Screen>
  );
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  picture: {
    borderRadius: radius.picture,
    backgroundColor: colors.picture,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  details: {
    gap: spacing.sm,
  },
  strong: {
    fontWeight: 'bold',
  },
}));
