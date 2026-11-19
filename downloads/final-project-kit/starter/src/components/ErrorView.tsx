import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { spacing } from '@/theme/spacing';

type ErrorViewProps = {
  // What went wrong, in words people understand (describeError's)
  message: string;
  onRetry: () => void;
};

// A failed load: what happened, and one button to try again
export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.box}>
      <AppText variant="error" accessibilityRole="alert">
        {message}
      </AppText>
      <Button label="Try again" variant="primary" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
});
