import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';

import { ApiError, describeError, postSignIn, setSession } from '@/api/client';
import { type SignInData, signInSchema } from '@/api/schemas';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ControlledField } from '@/components/ControlledField';
import { FormScreen } from '@/components/FormScreen';

// The sign-in modal. It exists only while nobody is signed in (Stack.Protected in _layout.tsx).
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
    defaultValues: { email: '', password: '' },
    // Check a field when the volunteer leaves it, then again as they fix it (as in the HQ)
    mode: 'onTouched',
  });

  // handleSubmit calls this only when the schema found nothing to fix
  async function submit(credentials: SignInData) {
    try {
      const session = await postSignIn(credentials);
      // Close the modal first, back to the screen that opened it. Then switch to signed in: the
      // guard takes this screen away at once, and if it were still open, you would land on the
      // first tab instead.
      if (router.canGoBack()) {
        router.back();
      }
      setSession(session);
    } catch (error) {
      resetField('password'); // never keep a password around after a try that did not work
      // 400: fields to fix; 401: wrong email or password. The API's own words fit both.
      const known = error instanceof ApiError && (error.status === 400 || error.status === 401);
      setError('root.server', { message: known ? error.message : describeError(error) });
    }
  }

  // Check, then submit. Called with no arguments: React Hook Form's handleSubmit expects a web
  // form event, and a phone's press and return key send different events
  const send = handleSubmit(submit);

  return (
    <FormScreen>
      <AppText>
        Sign in with your Shoreline Crew account to sign up for cleanups and see your own.
      </AppText>
      {errors.root?.server !== undefined && (
        <AppText variant="error" accessibilityRole="alert">
          {errors.root.server.message}
        </AppText>
      )}
      <ControlledField
        control={control}
        name="email"
        label="Email"
        inputMode="email" // the keyboard with @ and .
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect={false}
        enterKeyHint="next" // the return key says Next...
        submitBehavior="submit" // ...keeps the keyboard up...
        onSubmitEditing={() => setFocus('password')} // ...and moves to the password
      />
      <ControlledField
        control={control}
        name="password"
        label="Password"
        secureTextEntry // dots instead of letters
        autoComplete="current-password" // password managers offer the saved one
        autoCapitalize="none"
        enterKeyHint="go" // the last field: the return key signs in
        onSubmitEditing={() => send()}
      />
      <Button
        label={isSubmitting ? 'Signing in…' : 'Sign in'}
        variant="primary"
        disabled={isSubmitting}
        onPress={() => send()}
      />
    </FormScreen>
  );
}
