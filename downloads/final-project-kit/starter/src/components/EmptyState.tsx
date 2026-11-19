import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { spacing } from '@/theme/spacing';

type EmptyStateProps = {
  // Why the list is empty: "No items yet."
  message: string;
  // A way out, when there is one: a label and what pressing it does
  action?: { label: string; onPress: () => void };
};

// What a list shows when it has nothing to show
export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <View style={styles.box}>
      <AppText>{message}</AppText>
      {action && <Button label={action.label} variant="primary" onPress={action.onPress} />}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
});
