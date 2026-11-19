import { StyleSheet, Text, View } from 'react-native';

import type { CleanupEvent } from '@/api/types';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { getAvailability } from '@/utils/availability';
import { formatDate } from '@/utils/format';

type EventCardProps = {
  event: CleanupEvent;
};

// One cleanup in a list: the phone's version of the HQ's EventCard
export function EventCard({ event }: EventCardProps) {
  const availability = getAvailability(event);

  return (
    <View style={styles.card}>
      <AppText variant="heading" accessibilityRole="header">
        {event.title}
      </AppText>
      <AppText>
        {formatDate(event.date)}, {event.startTime} to {event.endTime}
      </AppText>
      <AppText variant="muted">Meet at: {event.meetingPoint}</AppText>
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

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  strong: {
    fontWeight: 'bold',
  },
});
