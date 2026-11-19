// Render some of the app's screens in a test, the way Expo Router shows them (Lesson 8.3)
import { QueryClientProvider } from '@tanstack/react-query';
import { type MockContextConfig, renderRouter } from 'expo-router/testing-library';
import type { ReactNode } from 'react';

import { queryClient } from '@/api/queries';

// The providers the screens need from the root layout. The app's own queryClient: mutations.ts
// refreshes data through it. Each test file clears it after each test.
function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

/** Show `routes` (file names as in src/app, each with its screen) at `initialUrl` */
export function renderScreens(routes: MockContextConfig, initialUrl = '/') {
  return renderRouter(routes, { initialUrl, wrapper: Providers });
}
