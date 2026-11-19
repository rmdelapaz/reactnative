import { act, screen } from '@testing-library/react-native';

import { setSession } from '@/api/client';
import TabLayout from '@/app/(tabs)/_layout';
import { AppText } from '@/components/AppText';
import { useLogQueue } from '@/state/logQueue';
import { makeLogToSend, volunteer } from '@/test/factories';
import { renderScreens } from '@/test/render';

beforeEach(() => {
  useLogQueue.setState(useLogQueue.getInitialState());
  setSession(volunteer);
});

// The real tab bar, with simple stand-ins for the four screens
function showTabs() {
  return renderScreens({
    '(tabs)/_layout': TabLayout,
    '(tabs)/index': () => <AppText>Cleanups screen</AppText>,
    '(tabs)/my-cleanups': () => <AppText>My cleanups screen</AppText>,
    '(tabs)/logbook': () => <AppText>Logbook screen</AppText>,
    '(tabs)/profile': () => <AppText>Profile screen</AppText>,
  });
}

// Tests run as an iPhone: there, each tab is a button whose name ends "tab, 3 of 4"
it('names the Logbook tab like the others while no log waits', async () => {
  await showTabs();
  expect(screen.getByRole('button', { name: 'Logbook, tab, 3 of 4' })).toHaveTextContent('Logbook');
});

it('puts the number of waiting logs in the words and the name of the Logbook tab', async () => {
  await showTabs();
  await act(() => useLogQueue.getState().add(volunteer.user.id, makeLogToSend('log-0001'), []));
  const logbook = screen.getByRole('button', { name: 'Logbook (1), not sent yet' });
  expect(logbook).toHaveTextContent('Logbook (1)'); // the name starts with the words you see
});

it("counts only the signed-in volunteer's logs", async () => {
  await showTabs();
  await act(() => useLogQueue.getState().add('v05', makeLogToSend('log-0002'), []));
  expect(screen.getByRole('button', { name: 'Logbook, tab, 3 of 4' })).toBeOnTheScreen();
});
