// Task 3 (reference): two screens under Expo Router's testing library
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
  const user = userEvent.setup();
  await renderRouter(routes);
  await user.press(screen.getByRole('link', { name: 'Open Tide Pool Morning Cleanup' }));
  expect(await screen.findByText('Meet at: Gravel pull-out on Highway 1')).toBeOnTheScreen();
  expect(screen).toHavePathname('/cleanups/e17');
});

it('says so for a cleanup that does not exist', async () => {
  await renderRouter(routes, { initialUrl: '/cleanups/e99' });
  expect(screen.getByRole('alert')).toHaveTextContent('No such cleanup: e99');
});
