import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

// TODO R1b. One stop, opened from the list or by a link (bookmobilestops://stops/s03, Lesson 4.4).
// - The id comes from the address (useLocalSearchParams, Lesson 4.1): stopQuery(id).
// - Loading: "Loading the stop…". A 404 (ApiError, status 404): "No stop with that id. Check the link."
//   and a "See all stops" button that goes to "/". Another error: <ErrorView>.
// - The stop: its name as the header title (<Stack.Screen options>) and as a title on the screen,
//   "When: " + scheduleLabel(stop) ("When: Mondays, 2:00 PM to 3:30 PM"), "Where: " + the address, and "Make this my stop"
//   (changeMyStop) or, when it is already, a "My stop" badge and "This is your stop."
export default function StopScreen() {
  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <AppText>TODO R1b: one stop (see TASKS.md)</AppText>
    </Screen>
  );
}
