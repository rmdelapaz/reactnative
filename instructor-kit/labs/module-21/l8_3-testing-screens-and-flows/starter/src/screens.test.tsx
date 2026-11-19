// Task 3: write the tests for two screens under Expo Router (src/screens/ works: do not change it).
// renderRouter builds a small app from the routes you list, written like file names in src/app.
import { screen, userEvent } from '@testing-library/react-native';
import { Stack } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';

import CleanupScreen from './screens/CleanupScreen';
import NextCleanupScreen from './screens/NextCleanupScreen';

// The two screens as an app: '/' and '/cleanups/[id]'
const routes = {
  _layout: () => <Stack />,
  index: NextCleanupScreen,
  'cleanups/[id]': CleanupScreen,
};

it("opens the next cleanup's own screen from its link", async () => {
  // TODO 3a: await renderRouter(routes); press the link named 'Open Tide Pool Morning Cleanup';
  // then expect(screen).toHavePathname('/cleanups/e17') and the meeting point on the screen
  throw new Error('TODO 3a: write this test');
});

it('says so for a cleanup that does not exist', async () => {
  // TODO 3b: start at '/cleanups/e99' (renderRouter's initialUrl option); expect the alert
  // 'No such cleanup: e99'
  throw new Error('TODO 3b: write this test');
});

// Keep the imports and routes used until you write the tests (delete these lines then)
void screen;
void userEvent;
void renderRouter;
void routes;
