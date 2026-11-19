// Tests (do not edit): npm test -- src/useOnForeground.test.tsx (Task 3)
import { render, screen } from '@testing-library/react-native';
import { AppState, type AppStateStatus, Text } from 'react-native';

import { useOnForeground } from './useOnForeground';

function TideTable({ refresh }: { refresh: () => void }) {
  useOnForeground(refresh);
  return <Text>Tide table</Text>;
}

afterEach(() => jest.restoreAllMocks());

test('Task 3: refreshes when the app comes back to the foreground', async () => {
  const listen = jest.spyOn(AppState, 'addEventListener').mockReturnValue({ remove: jest.fn() });
  const refresh = jest.fn();
  await render(<TideTable refresh={refresh} />);
  const onChange = listen.mock.calls[0][1] as (state: AppStateStatus) => void;
  onChange('background');
  onChange('active');
  expect(refresh).toHaveBeenCalledTimes(1);
});

test('Task 3: stops listening when the screen closes', async () => {
  const remove = jest.fn();
  jest.spyOn(AppState, 'addEventListener').mockReturnValue({ remove });
  await render(<TideTable refresh={jest.fn()} />);
  await screen.unmount();
  expect(remove).toHaveBeenCalledTimes(1);
});
