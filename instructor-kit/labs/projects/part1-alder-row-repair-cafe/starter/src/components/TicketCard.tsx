import { StyleSheet, View, type ViewStyle } from 'react-native';

import { createThemedStyles } from '../hooks/useTheme';
import { radius, spacing } from '../theme/spacing';
import type { Ticket } from '../types';
import { AppText } from './AppText';

type TicketCardProps = {
  ticket: Ticket;
  // The fixer pressed "Mark fixed" on a ticket that is on their table
  onMarkFixed: (id: string) => void;
  style?: ViewStyle;
};

// TODO C: one ticket. The item as a heading next to its tag number (#3); "<table> · brought by <owner>";
// the status in a Badge (statusLabels, statusTones); "Fixer: <name>" only when there is a fixer; a
// "Show problem" / "Hide problem" button (Pressable) that opens the problem, with accessibilityState
// expanded and a label that starts with the words it shows and says which item ("Show problem: Toaster"); and, only while a
// ticket is in repair, a primary Button "Mark fixed" (label "Mark fixed: Toaster") that calls onMarkFixed.
export function TicketCard({ ticket, style }: TicketCardProps) {
  const styles = useStyles();
  return (
    <View style={[styles.card, style]}>
      <AppText>{ticket.item}</AppText>
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
}));
