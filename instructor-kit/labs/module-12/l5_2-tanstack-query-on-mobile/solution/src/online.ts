// Task 2: a phone tells TanStack Query nothing about its connection: you hand it a source. In the app
// the source is NetInfo.addEventListener (it calls you with each change and returns "stop listening").
import { onlineManager } from '@tanstack/react-query';

export interface ConnectionState {
  isConnected: boolean | null;
}

export type ConnectionSource = (listener: (state: ConnectionState) => void) => () => void;

/** Feed TanStack Query's onlineManager from `source` */
export function connectOnlineManager(source: ConnectionSource): void {
  // The source returns its own "stop listening" function: exactly what setEventListener wants back
  onlineManager.setEventListener((setOnline) =>
    source((state) => {
      // null while the source does not know yet: count it as online, or the first load waits for nothing
      setOnline(state.isConnected !== false);
    }),
  );
}
