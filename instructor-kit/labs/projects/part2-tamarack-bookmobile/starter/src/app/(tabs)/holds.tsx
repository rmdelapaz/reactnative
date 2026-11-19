import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

// TODO R2b. The Holds tab has two faces (Lesson 4.3: the screen is kindness, the API's 401 is the rule).
// - A guest (useSession() is null): "Sign in to see and place holds." and a Sign in button that opens
//   the sign-in modal (a <Link href="/sign-in" asChild> around a <Button>).
// - A signed-in patron:
//   1. "On this phone": the patron's holds in the queue (useHoldQueue + useShallow, Lesson 5.5), each
//      with its book, "Pick up at <stop>", and either "Not sent yet" or the API's refusal + Remove;
//      a "Send now" button while any wait.
//   2. "Your holds": holdsQuery(viewerId(session)) with loading / error / empty ("You have no holds yet.
//      Find a book on the Books tab.") / the list: book, "Pick up at <stop>", "Ready at the stop" or
//      "Requested". Pull to refresh sends waiting holds first, then refetches.
export default function HoldsScreen() {
  return (
    <Screen>
      <AppText>TODO R2b: the Holds tab (see TASKS.md)</AppText>
    </Screen>
  );
}
