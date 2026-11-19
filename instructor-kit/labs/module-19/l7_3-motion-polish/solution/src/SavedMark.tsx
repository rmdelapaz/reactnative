import LottieView from 'lottie-react-native';
import { StyleSheet, Text, View } from 'react-native';

import saved from '../assets/saved.json';

const size = 72;

// Task 2: "the photo is saved", next to a heading that says the same in words. Lottie's player is not
// Reanimated, so ReducedMotionConfig never reaches it: this component decides itself.
export function SavedMark({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    // Decoration: aria-hidden hides it on iPhone, Android and in the web preview alike. The size is on this
    // View because the web preview's player fills its parent
    <View style={styles.mark} aria-hidden>
      {reduceMotion ? (
        <StillMark />
      ) : (
        <LottieView testID="saved-animation" source={saved} autoPlay loop={false} style={styles.mark} />
      )}
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
