import * as Updates from 'expo-updates';
import { Platform } from 'react-native';

// What expo-updates knows about the JavaScript this app is running (Lesson 9.3)
export type RunningCode = {
  where: 'web' | 'development' | 'build';
  isEnabled: boolean;
  channel: string | null;
  updateId: string | null;
  isEmbeddedLaunch: boolean;
  createdAt: Date | null;
};

export function currentRunningCode(): RunningCode {
  return {
    // The web preview has a stand-in expo-updates that reports "enabled": never trust it there
    where: Platform.OS === 'web' ? 'web' : __DEV__ ? 'development' : 'build',
    isEnabled: Updates.isEnabled,
    channel: Updates.channel,
    updateId: Updates.updateId,
    isEmbeddedLaunch: Updates.isEmbeddedLaunch,
    createdAt: Updates.createdAt,
  };
}

// Can this app ask Expo for an update? Only a release build (preview, production) with updates on
export function canCheckForUpdates(code: RunningCode): boolean {
  return code.where === 'build' && code.isEnabled;
}

// One line for Profile, under the version line: a tester's bug report needs it too
export function runningCodeLine(code: RunningCode): string {
  if (code.where === 'web') return 'Updates: not used in the web preview.';
  if (code.where === 'development') return 'Updates: off while developing. The code comes from Metro.';
  if (!code.isEnabled) return 'Updates: off. This build runs the code it was built with.';
  const channel = code.channel ? `channel ${code.channel}` : 'no channel';
  if (code.isEmbeddedLaunch || code.updateId === null) {
    return `Updates: on (${channel}). Running the code this build came with.`;
  }
  const shortId = code.updateId.slice(0, 8);
  const from = code.createdAt ? `, published ${code.createdAt.toISOString().slice(0, 10)}` : '';
  return `Updates: on (${channel}). Running update ${shortId}${from}.`;
}
