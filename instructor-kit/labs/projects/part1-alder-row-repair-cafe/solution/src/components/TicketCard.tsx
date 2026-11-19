import { useState } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { createThemedStyles } from '../hooks/useTheme';
import { radius, spacing } from '../theme/spacing';
import type { Ticket } from '../types';
import { categoryLabels, statusLabels, statusTones } from '../utils/tickets';
import { AppText } from './AppText';
import { Badge } from './Badge';
import { Button } from './Button';

type TicketCardProps = {
  ticket: Ticket;
  // The fixer pressed "Mark fixed" on a ticket that is on their table
  onMarkFixed: (id: string) => void;
  style?: ViewStyle;
};

// One ticket: its tag number and item, who brought it, where it is, and the problem behind a button
export function TicketCard({ ticket, onMarkFixed, style }: TicketCardProps) {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.card, style]}>
      <View style={styles.top}>
        <View style={styles.tag}>
          <AppText style={styles.tagText}>#{ticket.number}</AppText>
        </View>
        <AppText variant="heading" accessibilityRole="header" style={styles.item}>
          {ticket.item}
        </AppText>
      </View>
      <AppText variant="muted">
        {categoryLabels[ticket.category]} · brought by {ticket.owner}
      </AppText>
      <Badge label={statusLabels[ticket.status]} tone={statusTones[ticket.status]} />
      {ticket.fixer !== undefined && <AppText>Fixer: {ticket.fixer}</AppText>}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${open ? 'Hide' : 'Show'} problem: ${ticket.item}`}
        accessibilityState={{ expanded: open }}
        aria-expanded={open} // the web preview's attribute (accessibilityState covers the phones)
        onPress={() => setOpen(!open)}
        hitSlop={8}>
        <AppText style={styles.link}>{open ? 'Hide problem' : 'Show problem'}</AppText>
      </Pressable>
      {open && <AppText>{ticket.problem}</AppText>}
      {ticket.status === 'in-repair' && (
        <Button
          label="Mark fixed"
          variant="primary"
          accessibilityLabel={`Mark fixed: ${ticket.item}`}
          onPress={() => onMarkFixed(ticket.id)}
        />
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
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  tag: { minWidth: 40, alignItems: 'center', paddingVertical: 2, borderRadius: radius.control, backgroundColor: colors.banner },
  tagText: { color: colors.onBanner, fontWeight: '700' },
  item: { flexShrink: 1 }, // a long name wraps instead of pushing past the edge
  link: { color: colors.action, fontWeight: '600', textDecorationLine: 'underline' },
}));
