import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Item } from '@/api/types';
import { AppText } from '@/components/AppText';
import { createThemedStyles } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';
import { itemStatusLabels } from '@/utils/labels';

type ItemRowProps = {
  item: Item;
};

// One row of the list: the whole card is the link to the item's screen (one big target). A screen
// reader hears one link and reads its words, the name and the status: no accessibilityLabel that
// could say something different from what is on the screen (Lesson 8.1)
export function ItemRow({ item }: ItemRowProps) {
  const styles = useStyles();
  const status = itemStatusLabels[item.status];
  return (
    <Link href={{ pathname: '/items/[id]', params: { id: item.id } }} asChild>
      <Pressable
        accessibilityRole="link"
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <View style={styles.text}>
          <AppText style={styles.name}>{item.name}</AppText>
          <AppText variant="muted">{status}</AppText>
        </View>
      </Pressable>
    </Link>
  );
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  card: {
    minHeight: 48,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  pressed: {
    backgroundColor: colors.pressed,
  },
  text: {
    gap: spacing.xs,
  },
  name: {
    fontWeight: '600',
  },
}));
