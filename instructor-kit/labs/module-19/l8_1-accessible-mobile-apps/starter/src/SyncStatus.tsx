import { StyleSheet, Text } from 'react-native';

// Task 2: the photo uploader's status line ("Uploading 2 photos…", "2 photos uploaded"). It changes while the
// volunteer looks elsewhere. accessibilityLiveRegion makes TalkBack (Android) and the web preview say each new
// message.
export function SyncStatus({ message }: { message: string }) {
  // TODO 2: on iPhone, VoiceOver hears nothing: ask it to say each new message, queued behind whatever it is
  // saying already
  return (
    <Text accessibilityLiveRegion="polite" style={styles.status}>
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  status: { fontSize: 16 },
});
