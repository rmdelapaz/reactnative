import { render, screen, userEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CrashScreen } from '@/components/CrashScreen';
import { setReporter } from '@/monitoring/reportError';

// The safe-area sizes a 390 x 844 phone reports (Screen reads them)
const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

it('reports the error once and lets the volunteer try again', async () => {
  const reporter = jest.fn();
  setReporter(reporter);
  const retry = jest.fn(() => Promise.resolve());
  const error = new Error('Cannot read properties of undefined');

  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <CrashScreen error={error} retry={retry} />
    </SafeAreaProvider>,
  );

  expect(screen.getByRole('header', { name: 'Something went wrong' })).toBeOnTheScreen();
  expect(reporter).toHaveBeenCalledTimes(1);
  expect(reporter).toHaveBeenCalledWith(error, 'screen');
  await userEvent.setup().press(screen.getByRole('button', { name: 'Try again' }));
  expect(retry).toHaveBeenCalledTimes(1);
});
