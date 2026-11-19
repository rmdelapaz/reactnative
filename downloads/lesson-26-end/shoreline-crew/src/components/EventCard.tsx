import { useRecyclingState } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { type StyleProp, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import type { CleanupEvent, Site } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Detail } from '@/components/Detail';
import { StatusBadge } from '@/components/StatusBadge';
import { createThemedStyles } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';
import { getAvailability } from '@/utils/availability';
import { formatDate, toDateString } from '@/utils/format';

type EventCardProps = {
  event: CleanupEvent;
  // undefined when the cleanup's site is not in the list
  site: Site | undefined;
  // Extra layout from the screen, such as flex: 1 to share a row with another card
  style?: StyleProp<ViewStyle>;
};

// One cleanup in a list: the phone's version of the HQ's EventCard
export function EventCard({ event, site, style }: EventCardProps) {
  const availability = getAvailability(event);
  const isToday = event.date === toDateString(new Date());
  // Like useState, but back to false when this card is reused for another cleanup (FlashList
  // recycles cards as you scroll): an open card never hands its open details to the next one
  const [showDetails, setShowDetails] = useRecyclingState(false, [event.id]);
  const styles = useStyles();

  return (
    <View style={[styles.card, style]}>
      {site && (
        // A picture from the API has no size until it loads: the card's width and the
        // picture's own proportions give it one now
        <Image
          source={site.image.url}
          accessible
          accessibilityLabel={site.image.alt}
          style={[styles.picture, { aspectRatio: site.image.width / site.image.height }]}
          contentFit="cover"
          transition={200}
        />
      )}
      <AppText variant="heading" accessibilityRole="header">
        {event.title}
      </AppText>
      {/* A row of badges that wraps to a second line when it runs out of room */}
      <View style={styles.badges}>
        <StatusBadge status={event.status} />
        {isToday && <Badge label="Today" tone="attention" />}
      </View>
      <Detail icon="date" label="When">
        {formatDate(event.date)}, {event.startTime} to {event.endTime}
      </Detail>
      <Detail icon="place" label="Where">
        {site ? `${site.name}, ${site.town}` : 'Site to be confirmed'}
      </Detail>
      <Detail icon="meet" label="Meet at">
        {event.meetingPoint}
      </Detail>
      {availability.kind === 'open' && (
        <AppText>
          {/* A Text inside a Text inherits its color and size: only the weight changes */}
          <Text style={styles.strong}>{availability.spotsLeft}</Text> of {event.capacity} spots left
        </AppText>
      )}
      {availability.kind === 'full' && (
        <AppText style={styles.strong}>Full: new sign-ups join the waiting list</AppText>
      )}
      <View style={styles.actions}>
        {/* The cleanup's own screen: a Link passes its press and its address to the Button */}
        <Link href={{ pathname: '/cleanups/[id]', params: { id: event.id } }} asChild>
          <Button label="Open" variant="primary" accessibilityLabel={`Open ${event.title}`} />
        </Link>
        {/* The quick look, without leaving the list */}
        <Button
          label={showDetails ? 'Hide details' : 'Show details'}
          // A screen reader hears which cleanup, and whether its details are open
          accessibilityLabel={`${showDetails ? 'Hide' : 'Show'} details for ${event.title}`}
          aria-expanded={showDetails}
          onPress={() => setShowDetails((shown) => !shown)}
        />
      </View>
      {showDetails && (
        <>
          <AppText>{event.description}</AppText>
          {event.suppliesProvided.length > 0 && (
            <AppText variant="muted">We bring: {event.suppliesProvided.join(', ')}</AppText>
          )}
        </>
      )}
    </View>
  );
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  picture: {
    borderRadius: radius.picture,
    backgroundColor: colors.picture,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap', // with very large text, the second button moves to its own line
    gap: spacing.sm,
  },
  strong: {
    fontWeight: 'bold',
  },
}));
