import { useHeaderHeight } from 'expo-router/react-navigation';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';

import { useScreenScroll } from '@/components/Screen';

// A screen with a form on it (Lesson 5.4): it scrolls, and it gets out of the keyboard's way
export function FormScreen({ children }: { children: ReactNode }) {
  const screen = useScreenScroll(['bottom', 'left', 'right']);
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={headerHeight} style={styles.fill}>
      <ScrollView {...screen}>{children}</ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
