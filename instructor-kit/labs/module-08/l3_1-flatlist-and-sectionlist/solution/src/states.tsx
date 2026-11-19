import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

// Given: the three things a list shows when it has no beaches (Lesson 3.1's LoadingView, ErrorView, EmptyState)
export function Loading({ label }: { label: string }) {
  return (
    <View style={styles.box}>
      <ActivityIndicator size="large" aria-hidden />
      <Text>{label}</Text>
    </View>
  );
}

export function Failed({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.box}>
      <Text accessibilityRole="alert">{message}</Text>
      <Pressable accessibilityRole="button" onPress={onRetry} style={styles.button}>
        <Text>Try again</Text>
      </Pressable>
    </View>
  );
}

export function Empty({ message, action }: { message: string; action?: { label: string; onPress: () => void } }) {
  return (
    <View style={styles.box}>
      <Text>{message}</Text>
      {action && (
        <Pressable accessibilityRole="button" onPress={action.onPress} style={styles.button}>
          <Text>{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: 12, paddingVertical: 16 },
  button: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
});
