import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { Stop } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { spacing } from '@/theme/spacing';
import { scheduleLabel } from '@/utils/schedule';

// One stop in the list: its name, when the van is there, where, and a way to open it
export function StopCard({ stop, isMyStop }: { stop: Stop; isMyStop: boolean }) {
  return (
    <Card>
      <View style={styles.top}>
        <AppText variant="heading" accessibilityRole="header">
          {stop.name}
        </AppText>
        {isMyStop && <Badge label="My stop" tone="attention" />}
      </View>
      <AppText>{scheduleLabel(stop)}</AppText>
      <AppText variant="muted">{stop.address}</AppText>
      <Link href={{ pathname: '/stops/[id]', params: { id: stop.id } }} asChild>
        <Button label="Open" accessibilityLabel={`Open ${stop.name}`} />
      </Link>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
