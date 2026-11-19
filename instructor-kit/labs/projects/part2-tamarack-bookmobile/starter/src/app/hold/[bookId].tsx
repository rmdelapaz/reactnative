import { AppText } from '@/components/AppText';
import { FormScreen } from '@/components/FormScreen';

// TODO R5b. The place-hold form, a modal (Lesson 5.4; the hold then rides in the queue, Lesson 5.5).
// - The book comes from the address (bookId) and booksQuery(''); the stops from stopsQuery().
// - A guest: "Sign in to place a hold." and a Sign in button. An unknown book: "No book with that id.
//   Check the link."
// - The form: the book's title as a header, then React Hook Form with zodResolver(holdSchema):
//   a <ChoiceGroup label="Pick up at"> of the stops (useController for stopId; My stop chosen already
//   when there is one), a <ControlledField label="Note for the librarian (optional)">, and a
//   "Place hold" button.
// - A clientId made ONCE per form (useState(() => randomUUID()) from expo-crypto), never per press.
// - On a valid submit: add the hold to the queue (useHoldQueue), show "Your hold on <title> is saved
//   on this phone. It is sent as soon as you are online." with a Done button, and start
//   sendWaitingHolds(patronId) (it does nothing offline).
export default function PlaceHoldScreen() {
  return (
    <FormScreen>
      <AppText>TODO R5b: the place-hold form (see TASKS.md)</AppText>
    </FormScreen>
  );
}
