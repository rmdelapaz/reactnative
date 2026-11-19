import { Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { cleanupLink } from './links';
import type { CleanupEvent } from './types';

// "Share this cleanup": the phone's share sheet, with a message and a link that opens the cleanup
export function ShareButton({ event }: { event: CleanupEvent }) {
  async function share() {
    const link = cleanupLink(event.id);
    try {
      // TODO 2a: this looks fine on an iPhone. On Android the friend gets no link at all: why?
      await Share.share({ title: event.title, message: `Join me at ${event.title}!`, url: link });
    } catch {
      // TODO 2b: no share sheet here (the web preview in a desktop browser): show the link to copy instead
    }
  }

  return (
    <View style={styles.box}>
      <Pressable accessibilityRole="button" onPress={share} style={styles.button}>
        <Text>Share this cleanup</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: 8 },
  button: { minHeight: 48, justifyContent: 'center' },
});
