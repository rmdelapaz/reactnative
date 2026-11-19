import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { CleanupEvent } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { StatusBadge } from '@/components/StatusBadge';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { getAvailability } from '@/utils/availability';
import { formatDate, toDateString } from '@/utils/format';

type EventCardProps = {
  event: CleanupEvent;
};

// One cleanup in a list: the phone's version of the HQ's EventCard
export function EventCard({ event }: EventCardProps) {
  const availability = getAvailability(event);
  const isToday = event.date === toDateString(new Date());

  return (
    <View style={styles.card}>
      <AppText variant="heading" accessibilityRole="header">
        {event.title}
      </AppText>
      {/* A row of badges that wraps to a second line when it runs out of room */}
      <View style={styles.badges}>
        <StatusBadge status={event.status} />
        {isToday && <Badge label="Today" tone="attention" />}
      </View>
      <Detail label="When">
        {formatDate(event.date)}, {event.startTime} to {event.endTime}
      </Detail>
      <Detail label="Meet at">{event.meetingPoint}</Detail>
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
  label: string;
  children: ReactNode;
};

// A label and its value side by side: the label keeps its width, the value takes the rest
function Detail({ label, children }: DetailProps) {
  return (
    <View style={styles.detail}>
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
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  detail: {
    flexDirection: 'row',
    gap: spacing.sm,
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
