// The lab's root stack: which screens exist, and for whom (Lesson 4.3's Stack.Protected)
import { Stack } from 'expo-router';

import { useSession } from './useSession';

export function CrewStack() {
  const session = useSession();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Cleanups' }} />
      {/* Only for organizers: the volunteers' app has no business showing the gear shed's keys */}
      <Stack.Protected guard={session?.user.role === 'organizer'}>
        <Stack.Screen name="kit-room" options={{ title: 'Kit room' }} />
      </Stack.Protected>
      {/* Only for people who are not signed in: signing in takes this screen away. (The course app
          presents it as a modal; a modal needs a screen underneath it, which Lesson 4.4's anchor gives.) */}
      <Stack.Protected guard={session === null}>
        <Stack.Screen name="sign-in" options={{ title: 'Sign in' }} />
      </Stack.Protected>
    </Stack>
  );
}
