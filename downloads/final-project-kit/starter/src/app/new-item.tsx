import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';

import { ApiError, describeError } from '@/api/client';
import { createItemMutation } from '@/api/mutations';
import { type NewItemValues, newItemSchema } from '@/api/schemas';
import type { NewItem } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ControlledField } from '@/components/ControlledField';
import { FormScreen } from '@/components/FormScreen';

// The New item form (a modal, Lesson 4.2): React Hook Form + Zod as in the web course, with a
// phone's keyboard (Lesson 5.4), and the server's own rules shown under the field they are about
export default function NewItemScreen() {
  const create = useMutation(createItemMutation());
  const {
    control,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewItemValues, unknown, NewItem>({
    resolver: zodResolver(newItemSchema),
    defaultValues: { name: '', note: '' },
    mode: 'onTouched',
  });

  async function submit(item: NewItem) {
    try {
      await create.mutateAsync(item);
      // Back to the list, which has the new item already (the mutation refreshed it). Opened from
      // a link, there is nothing underneath: the list takes the form's place
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch (error) {
      const nameProblem = error instanceof ApiError ? error.fieldErrors?.name?.[0] : undefined;
      if (nameProblem !== undefined) {
        setError('name', { message: nameProblem }, { shouldFocus: true });
      } else {
        setError('root.server', { message: describeError(error) });
      }
    }
  }

  // Called with no arguments: a phone's press and return key send different events
  const save = handleSubmit(submit);

  return (
    <FormScreen>
      {errors.root?.server !== undefined && (
        <AppText variant="error" accessibilityRole="alert">
          {errors.root.server.message}
        </AppText>
      )}
      <ControlledField
        control={control}
        name="name"
        label="Name"
        autoCapitalize="sentences"
        enterKeyHint="next"
        submitBehavior="submit"
        onSubmitEditing={() => setFocus('note')}
      />
      <ControlledField
        control={control}
        name="note"
        label="Note (optional)"
        multiline
        numberOfLines={3}
      />
      <Button
        label={isSubmitting ? 'Saving…' : 'Save'}
        variant="primary"
        disabled={isSubmitting}
        onPress={() => save()}
      />
    </FormScreen>
  );
}
