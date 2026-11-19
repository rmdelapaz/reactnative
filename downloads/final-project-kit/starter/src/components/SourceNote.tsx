import { type DataSource, readDataSource } from '@/api/source';
import { AppText } from '@/components/AppText';

function currentSource(): DataSource | Error {
  try {
    return readDataSource();
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
}

// Which data is this? Demo data says so, so nobody mistakes the sample data for real data (a
// tester, a reviewer, your client); a server's address can be read on the phone in ten seconds
// (Lesson 5.1); a wrong EXPO_PUBLIC_API_URL says what to fix.
export function SourceNote() {
  const source = currentSource();
  if (source instanceof Error) {
    return (
      <AppText variant="error" accessibilityRole="alert">
        {source.message}
      </AppText>
    );
  }
  if (source.kind === 'demo') {
    return <AppText variant="muted">Demo data: changes are kept until the app restarts.</AppText>;
  }
  return <AppText variant="muted">Data from {source.baseUrl}</AppText>;
}
