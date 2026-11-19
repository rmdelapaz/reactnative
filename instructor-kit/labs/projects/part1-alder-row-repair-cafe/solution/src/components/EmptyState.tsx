import { StyleSheet, View } from 'react-native';

import { spacing } from '../theme/spacing';
import { AppText } from './AppText';
import { Button } from './Button';

type EmptyStateProps = { message: string; action?: { label: string; onPress: () => void } };

// What a list shows when it has nothing to show (Lesson 3.1)
export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <View style={styles.box}>
      <AppText>{message}</AppText>
      {action && <Button label={action.label} variant="primary" onPress={action.onPress} />}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: spacing.md, paddingVertical: spacing.md },
});
