import LottieView from 'lottie-react-native';
import { StyleSheet, Text, View } from 'react-native';

import saved from '../assets/saved.json';

const size = 72;

// Task 2: "the photo is saved", next to a heading that says the same in words. Lottie's player is not
// Reanimated, so ReducedMotionConfig never reaches it: this component decides itself.
export function SavedMark({ reduceMotion }: { reduceMotion: boolean }) {
  // TODO 2: with less motion, show the still mark instead; play once, not forever; and hide the mark
  // from screen readers (one prop that works on iPhone, Android and in the web preview)
  return (
    <View style={styles.mark}>
      <LottieView testID="saved-animation" source={saved} autoPlay loop style={styles.mark} />
    </View>
  );
}

// The still mark, for when motion should step aside
export function StillMark() {
  return <Text style={styles.still}>✓</Text>;
}

const styles = StyleSheet.create({
  mark: { width: size, height: size },
  still: { fontSize: 56, lineHeight: size, textAlign: 'center', color: '#1f6f8b' },
});
