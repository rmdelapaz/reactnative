import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { CleanupEvent, Site } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Icon, type IconName } from '@/components/Icon';
import { StatusBadge } from '@/components/StatusBadge';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { getAvailability } from '@/utils/availability';
import { formatDate, toDateString } from '@/utils/format';

type EventCardProps = {
  event: CleanupEvent;
  // undefined when the cleanup's site is not in the list
  site: Site | undefined;
};

// One cleanup in a list: the phone's version of the HQ's EventCard
export function EventCard({ event, site }: EventCardProps) {
  const availability = getAvailability(event);
  const isToday = event.date === toDateString(new Date());

  return (
    <View style={styles.card}>
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
    </View>
  );
}

type DetailProps = {
  icon: IconName;
  label: string;
  children: ReactNode;
};

// An icon, a label and its value side by side: the label keeps its width, the value takes the rest
function Detail({ icon, label, children }: DetailProps) {
  return (
    <View style={styles.detail}>
      <View style={styles.detailIcon}>
        <Icon name={icon} />
      </View>
      <AppText variant="muted" style={styles.detailLabel}>
        {label}
      </AppText>
      <AppText style={styles.detailValue}>{children}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
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
  detail: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  detailIcon: {
    height: 24, // one line of text: the icon centers on the first line of the value
    justifyContent: 'center',
  },
  detailLabel: {
    width: 72,
  },
  detailValue: {
    flex: 1, // take the space the label leaves, and wrap inside it
  },
  strong: {
    fontWeight: 'bold',
  },
});
