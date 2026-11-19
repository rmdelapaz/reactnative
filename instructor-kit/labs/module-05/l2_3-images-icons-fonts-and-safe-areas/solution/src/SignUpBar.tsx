import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// A bar pinned to the bottom does not scroll, so it adds the bottom inset itself: its background reaches the
// bottom of the glass, its button stays above the home indicator (0 on a phone with a home button).
export function SignUpBar({ onSignUp }: { onSignUp: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View testID="sign-up-bar" style={[styles.bar, { paddingBottom: 16 + insets.bottom }]}>
      <Pressable accessibilityRole="button" onPress={onSignUp} style={styles.button}>
        <Text style={styles.label}>Sign up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { paddingTop: 12, paddingHorizontal: 16, backgroundColor: '#0b3954' },
  button: { minHeight: 48, justifyContent: 'center', borderRadius: 8, backgroundColor: '#ffffff' },
  label: { textAlign: 'center', fontWeight: '600', color: '#0b3954' },
});
