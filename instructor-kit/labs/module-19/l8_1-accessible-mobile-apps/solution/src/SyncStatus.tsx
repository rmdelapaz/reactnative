import { useEffect } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, Text } from 'react-native';

// Task 2: the photo uploader's status line ("Uploading 2 photos…", "2 photos uploaded"). It changes while the
// volunteer looks elsewhere. accessibilityLiveRegion makes TalkBack (Android) and the web preview say each new
// message.
export function SyncStatus({ message }: { message: string }) {
  useEffect(() => {
    // iPhone has no live regions: VoiceOver says the new words because we ask it to, after what it is saying
    if (Platform.OS === 'ios' && message !== '') {
      AccessibilityInfo.announceForAccessibilityWithOptions(message, { queue: true });
    }
  }, [message]);
  return (
    <Text accessibilityLiveRegion="polite" style={styles.status}>
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  status: { fontSize: 16 },
});
