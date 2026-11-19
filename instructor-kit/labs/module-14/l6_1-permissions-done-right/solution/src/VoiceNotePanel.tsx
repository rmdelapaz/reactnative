// "Add a voice note" on a debris log: the microphone is asked for only after the press
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AskFirst } from './AskFirst';
import { useMicrophonePermissions } from './microphone';
import { usePermission } from './usePermission';

export function VoiceNotePanel() {
  const [wanted, setWanted] = useState(false);
  return (
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={styles.heading}>
        Voice note
      </Text>
      {wanted ? (
        <Recorder onNotNow={() => setWanted(false)} />
      ) : (
        <Pressable accessibilityRole="button" onPress={() => setWanted(true)}>
          <Text>Add a voice note</Text>
        </Pressable>
      )}
    </View>
  );
}

// Mounted only after the press: the Hook reads the answer here, and asks nobody
function Recorder({ onNotNow }: { onNotNow: () => void }) {
  const microphone = usePermission(useMicrophonePermissions());
  return (
    <AskFirst
      permission={microphone}
      what="your microphone"
      why="Shoreline Crew uses the microphone only while you hold Record, to add a voice note to this log."
      onNotNow={onNotNow}
    >
      <Text>Ready: hold Record and talk.</Text>
    </AskFirst>
  );
}

const styles = StyleSheet.create({
  panel: { gap: 8 },
  heading: { fontSize: 20, fontWeight: 'bold' },
});
