import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';

import { ApiError, describeError, postSignIn, setSession } from '@/api/client';
import { type SignInData, signInSchema } from '@/api/schemas';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ControlledField } from '@/components/ControlledField';
import { FormScreen } from '@/components/FormScreen';

// The sign-in modal (GIVEN). It exists only while nobody is signed in (Stack.Protected in _layout.tsx).
export default function SignInScreen() {
  const {
    control,
    handleSubmit,
    setFocus,
    setError,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { cardNumber: '', pin: '' },
    mode: 'onTouched',
  });

  async function submit(credentials: SignInData) {
    try {
      const session = await postSignIn(credentials);
      // Close the modal first, then switch to signed in: the guard takes this screen away
      if (router.canGoBack()) {
        router.back();
      }
      setSession(session);
    } catch (error) {
      resetField('pin'); // never keep a PIN around after a try that did not work
      const known = error instanceof ApiError && (error.status === 400 || error.status === 401);
      setError('root.server', { message: known ? error.message : describeError(error) });
    }
  }

  const send = handleSubmit(submit);

  return (
    <FormScreen>
      <AppText>Sign in with your Tamarack County Library card to place holds and see them.</AppText>
      {errors.root?.server !== undefined && (
        <AppText variant="error" accessibilityRole="alert">
          {errors.root.server.message}
        </AppText>
      )}
      <ControlledField
        control={control}
        name="cardNumber"
        label="Library card number"
        inputMode="numeric"
        autoComplete="off"
        enterKeyHint="next"
        submitBehavior="submit"
        onSubmitEditing={() => setFocus('pin')}
      />
      <ControlledField
        control={control}
        name="pin"
        label="PIN"
        inputMode="numeric"
        secureTextEntry
        maxLength={4}
        enterKeyHint="go"
        onSubmitEditing={() => send()}
      />
      <Button label={isSubmitting ? 'Signing in…' : 'Sign in'} variant="primary" disabled={isSubmitting} onPress={() => send()} />
    </FormScreen>
  );
}
