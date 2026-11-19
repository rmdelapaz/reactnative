import { router } from 'expo-router';
import { useState } from 'react';

import { ApiError, describeError, postSignIn, setSession } from '@/api/client';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { Screen } from '@/components/Screen';

// Why the last try did not work: one message for the form, and one per field the API named
type Problem = { message: string; fields: Record<string, string[]> };

// The sign-in modal. It exists only while nobody is signed in (Stack.Protected in _layout.tsx).
export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sending, setSending] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);

  async function submit() {
    setSending(true);
    setProblem(null);
    try {
      const session = await postSignIn({ email: email.trim(), password });
      // Close the modal first, back to the screen that opened it. Then switch to signed in: the
      // guard takes this screen away at once, and if it were still open, you would land on the
      // first tab instead.
      if (router.canGoBack()) {
        router.back();
      }
      setSession(session);
    } catch (error) {
      setPassword(''); // never keep a password around after a try that did not work
      setProblem(
        // 400: fields to fix; 401: wrong email or password. The API's own words fit both.
        error instanceof ApiError && (error.status === 400 || error.status === 401)
          ? { message: error.message, fields: error.fieldErrors ?? {} }
          : { message: describeError(error), fields: {} },
      );
      setSending(false);
    }
  }

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <AppText>
        Sign in with your Shoreline Crew account to sign up for cleanups and see your own.
      </AppText>
      {problem !== null && (
        <AppText variant="error" accessibilityRole="alert">
          {problem.message}
        </AppText>
      )}
      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={problem?.fields.email?.join(' ')}
        keyboardType="email-address" // the keyboard with @ and .
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormField
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={problem?.fields.password?.join(' ')}
        secureTextEntry // dots instead of letters
        autoComplete="current-password" // password managers offer the saved one
        autoCapitalize="none"
      />
      <Button
        label={sending ? 'Signing in…' : 'Sign in'}
        variant="primary"
        disabled={sending}
        onPress={submit}
      />
    </Screen>
  );
}
