// Task 1: every useQuery and useInfiniteQuery finds its cache through this provider
import type { QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

export function Providers({ client, children }: { client: QueryClient; children: ReactNode }) {
  // TODO 1: give the children the client (as the root layout does in Lesson 5.2)
  return <>{children}</>;
}
