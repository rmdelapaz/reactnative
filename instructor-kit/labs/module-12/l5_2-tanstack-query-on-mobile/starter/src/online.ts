// Task 2: a phone tells TanStack Query nothing about its connection: you hand it a source. In the app
// the source is NetInfo.addEventListener (it calls you with each change and returns "stop listening").
export interface ConnectionState {
  isConnected: boolean | null;
}

export type ConnectionSource = (listener: (state: ConnectionState) => void) => () => void;

/** Feed TanStack Query's onlineManager from `source` */
export function connectOnlineManager(source: ConnectionSource): void {
  // TODO 2: onlineManager.setEventListener, with null counted as online (NetInfo does not know yet)
}
