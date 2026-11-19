import { useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { cleanupLink, inviteMessage } from './links';
import type { CleanupEvent } from './types';

// "Share this cleanup": the phone's share sheet, with a message and a link that opens the cleanup
export function ShareButton({ event }: { event: CleanupEvent }) {
  // The link to copy, when this device has no share sheet to send it with
  const [linkToCopy, setLinkToCopy] = useState<string | null>(null);

  async function share() {
    const link = cleanupLink(event.id);
    try {
      // Android shares the title and the message only, so the link goes inside the message
      await Share.share({ title: event.title, message: inviteMessage(event, link) });
    } catch {
      // No share sheet here (the web preview in most desktop browsers): show the link instead
      setLinkToCopy(link);
    }
  }

  return (
    <View style={styles.box}>
      <Pressable accessibilityRole="button" onPress={share} style={styles.button}>
        <Text>Share this cleanup</Text>
      </Pressable>
      {linkToCopy !== null && (
        <Text selectable accessibilityLiveRegion="polite">
          Sharing is not available here. Copy this link instead: {linkToCopy}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: 8 },
  button: { minHeight: 48, justifyContent: 'center' },
});
