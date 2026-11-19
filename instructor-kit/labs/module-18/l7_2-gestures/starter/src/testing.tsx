// Test helpers (do not edit): the root view Gesture Handler needs around anything with a gesture
import type { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export function WithGestures({ children }: { children: ReactNode }) {
  return <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>;
}
