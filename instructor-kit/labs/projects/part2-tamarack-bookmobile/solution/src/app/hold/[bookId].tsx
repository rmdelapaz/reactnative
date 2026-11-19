import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { randomUUID } from 'expo-crypto';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useController, useForm } from 'react-hook-form';

import { describeError, type Session } from '@/api/client';
import { booksQuery, stopsQuery } from '@/api/queries';
import { type HoldData, holdSchema } from '@/api/schemas';
import type { Book, Stop } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ChoiceGroup } from '@/components/ChoiceGroup';
import { ControlledField } from '@/components/ControlledField';
import { ErrorView } from '@/components/ErrorView';
import { FormScreen } from '@/components/FormScreen';
import { LoadingView } from '@/components/LoadingView';
import { useSession } from '@/hooks/useSession';
import { useHoldQueue } from '@/state/holdQueue';
import { readMyStop } from '@/state/myStop';
import { sendWaitingHolds } from '@/state/sendHolds';

// TODO R5b (done). The place-hold form (Lesson 5.4), a modal. The hold goes into the queue on this
// phone first (Lesson 5.5), then the queue sends it: with one bar of signal, nothing is lost.
export default function PlaceHoldScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const session = useSession();
  const books = useQuery(booksQuery(''));
  const stops = useQuery(stopsQuery());

  if (session === null) {
    return (
      <FormScreen>
        <AppText>Sign in to place a hold.</AppText>
        <Link href="/sign-in" asChild>
          <Button label="Sign in" variant="primary" />
        </Link>
      </FormScreen>
    );
  }
  if (books.isPending || stops.isPending) {
    return (
      <FormScreen>
        <LoadingView label="Loading…" />
      </FormScreen>
    );
  }
  if (books.isError || stops.isError) {
    return (
      <FormScreen>
        <ErrorView
          message={describeError(books.error ?? stops.error)}
          onRetry={() => {
            void books.refetch();
            void stops.refetch();
          }}
        />
      </FormScreen>
    );
  }
  const book = books.data.find((item) => item.id === bookId);
  if (book === undefined) {
    return (
      <FormScreen>
        <AppText accessibilityRole="alert">No book with that id. Check the link.</AppText>
      </FormScreen>
    );
  }
  return <HoldForm book={book} stops={stops.data} session={session} />;
}

function HoldForm({ book, stops, session }: { book: Book; stops: Stop[]; session: Session }) {
  // Made ONCE per hold, when the form opens: a resend then carries the same id (Lesson 5.4)
  const [clientId] = useState(() => randomUUID());
  const [saved, setSaved] = useState(false);
  const addHold = useHoldQueue((state) => state.add);
  const myStop = readMyStop();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(holdSchema),
    defaultValues: { stopId: stops.some((stop) => stop.id === myStop) ? (myStop ?? '') : '', note: '' },
  });
  // The stop is chosen with buttons, not typed: useController hands over its value and message
  const {
    field: { value: stopId, onChange: chooseStop },
    fieldState: { error: stopError },
  } = useController({ control, name: 'stopId' });

  function submit({ stopId: chosen, note }: HoldData) {
    const stop = stops.find((item) => item.id === chosen);
    addHold(session.patron.id, {
      clientId,
      bookId: book.id,
      bookTitle: book.title,
      stopId: chosen,
      stopName: stop?.name ?? chosen,
      note,
    });
    setSaved(true);
    void sendWaitingHolds(session.patron.id); // now, if there is a connection; later otherwise
  }
  const send = handleSubmit(submit);

  if (saved) {
    return (
      <FormScreen>
        <AppText accessibilityRole="alert">
          Your hold on {book.title} is saved on this phone. It is sent as soon as you are online.
        </AppText>
        <Button label="Done" variant="primary" onPress={() => (router.canGoBack() ? router.back() : router.replace('/holds'))} />
      </FormScreen>
    );
  }
  return (
    <FormScreen>
      <AppText variant="heading" accessibilityRole="header">
        {book.title}
      </AppText>
      <AppText variant="muted">{book.author}</AppText>
      <ChoiceGroup
        label="Pick up at"
        choices={stops.map((stop) => ({ value: stop.id, label: stop.name }))}
        value={stopId}
        onChange={chooseStop}
        error={stopError?.message}
      />
      <ControlledField
        control={control}
        name="note"
        label="Note for the librarian (optional)"
        multiline
        maxLength={140}
        placeholder="Large print if you have it"
      />
      <Button label="Place hold" variant="primary" onPress={() => send()} />
    </FormScreen>
  );
}
