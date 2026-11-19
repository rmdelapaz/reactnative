import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

// TODO R3b. The Stops tab (src/app/(tabs)/books.tsx is the model): stopsQuery() with
// - loading: <LoadingView label="Loading stops…" />
// - an error: <ErrorView> with describeError(...) and Try again
// - no stops: "No stops are scheduled this week."
// - the list: <NearestStop stops={...} /> first, then "8 stops this week", a Refresh button (the web
//   preview has no pull gesture), and a <StopCard> per stop, isMyStop from useMyStop()
// - pull to refresh: a RefreshControl with your own refreshing flag; useRefreshOnFocus('stops')
export default function StopsScreen() {
  return (
    <Screen>
      <AppText>TODO R3b: the Stops tab (see TASKS.md)</AppText>
    </Screen>
  );
}
