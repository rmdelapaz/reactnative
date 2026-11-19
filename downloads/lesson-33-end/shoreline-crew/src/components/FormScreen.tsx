import { useHeaderHeight } from 'expo-router/react-navigation';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';

import { useScreenScroll } from '@/components/Screen';

type FormScreenProps = {
  children: ReactNode;
  edges?: readonly Edge[];
};

// A screen with a form on it: it scrolls like <Screen scroll>, and it gets out of the keyboard's way.
// When the keyboard comes up, KeyboardAvoidingView adds padding at the bottom as tall as the
// keyboard, so the scroll view ends above it and every field can be scrolled into sight.
export function FormScreen({ children, edges = ['bottom', 'left', 'right'] }: FormScreenProps) {
  const screen = useScreenScroll(edges);
  // The keyboard is measured from the top of the window, the screen starts under the header
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      // padding on both: iOS lays the keyboard over the app, and Expo apps on Android are
      // edge-to-edge, so the window no longer shrinks for the keyboard by itself
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
      style={styles.fill}
    >
      <ScrollView {...screen}>{children}</ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
