// Render some of the app's screens in a test, the way Expo Router shows them (GIVEN)
import { QueryClientProvider } from '@tanstack/react-query';
import { type MockContextConfig, renderRouter } from 'expo-router/testing-library';
import type { ReactNode } from 'react';

import { queryClient } from '@/api/queries';

function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

/** Show `routes` (file names as in src/app, each with its screen) at `initialUrl` */
export function renderScreens(routes: MockContextConfig, initialUrl = '/') {
  return renderRouter(routes, { initialUrl, wrapper: Providers });
}
