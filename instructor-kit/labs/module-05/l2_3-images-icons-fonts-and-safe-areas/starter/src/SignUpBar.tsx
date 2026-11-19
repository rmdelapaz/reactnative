import { Pressable, StyleSheet, Text, View } from 'react-native';

// Task 3: a bar pinned to the bottom of a detail screen (it does not scroll). On a phone with a home indicator
// the button sits under the gesture bar. Keep the bar's background down to the bottom of the glass, and its
// button above the home indicator: the bar adds the phone's bottom inset to its own bottom padding.
export function SignUpBar({ onSignUp }: { onSignUp: () => void }) {
  return (
    <View testID="sign-up-bar" style={styles.bar}>
      <Pressable accessibilityRole="button" onPress={onSignUp} style={styles.button}>
        <Text style={styles.label}>Sign up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { paddingTop: 12, paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#0b3954' },
  button: { minHeight: 48, justifyContent: 'center', borderRadius: 8, backgroundColor: '#ffffff' },
  label: { textAlign: 'center', fontWeight: '600', color: '#0b3954' },
});
