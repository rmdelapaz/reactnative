import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { TicketCard } from '../components/TicketCard';
import { tickets } from '../data/tickets';
import { createThemedStyles } from '../hooks/useTheme';
import { radius, spacing } from '../theme/spacing';

// TODO D: the repair queue, as the brief describes it (TASKS.md). Today it is a ScrollView with every card.
// It becomes a list that is the whole screen (useScreenScroll), with a header ELEMENT above the tickets: the
// banner, a search field "Search repairs", the switches "Hide finished repairs" and "Group by table", and the
// heading "Today's repairs" with the count (countLabel). Keys from the ticket's id, two columns at 700 wide
// (useColumns), "No repairs match your search." with a "Show all repairs" action, "Mark fixed" that changes
// the ticket in state, and the tickets under their tables in a SectionList when "Group by table" is on.
export default function Queue() {
  const styles = useStyles();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.banner}>
        <AppText variant="title" accessibilityRole="header">
          Fix-It Tables
        </AppText>
        <AppText style={styles.bannerSub}>Alder Row Repair Café</AppText>
      </View>
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} onMarkFixed={() => {}} />
      ))}
    </ScrollView>
  );
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.page },
  content: { gap: spacing.md, padding: spacing.md },
  banner: { gap: spacing.xs, padding: spacing.md, borderRadius: radius.card, backgroundColor: colors.banner },
  bannerSub: { color: colors.onBannerAccent },
}));
