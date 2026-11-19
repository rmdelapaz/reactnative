import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';

import logSent from '@/assets/animations/log-sent.json';
import { Icon } from '@/components/Icon';
import { useTheme } from '@/hooks/useTheme';
import { useReduceMotion } from '@/state/motion';

const size = 96;

// "It reached the server": a check mark that draws itself once (a Lottie animation drawn for
// Shoreline Crew), or a still one when motion should step aside. Decoration: the heading beside
// it says the same in words, so screen readers skip it.
export function LogSentMark() {
  const reduceMotion = useReduceMotion();
  const { colors } = useTheme();
  return (
    // The size goes on this View: the web preview's player ignores style and fills its parent.
    // aria-hidden hides it from screen readers on iPhone, Android and the web preview alike.
    <View style={styles.mark} aria-hidden>
      {reduceMotion ? (
        <Icon name="sent" size={size} color={colors.action} />
      ) : (
        <LottieView source={logSent} autoPlay loop={false} style={styles.mark} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    width: size,
    height: size,
  },
});
