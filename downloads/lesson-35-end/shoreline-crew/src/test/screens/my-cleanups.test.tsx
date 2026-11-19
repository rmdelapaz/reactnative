import { screen } from '@testing-library/react-native';
import { Stack } from 'expo-router';

import { checkIn, setSession } from '@/api/client';
import { queryClient } from '@/api/queries';
import MyCleanupsScreen from '@/app/(tabs)/my-cleanups';
import { volunteer } from '@/test/factories';
import { renderScreens } from '@/test/render';
import { startMockApi } from '@/test/server';

// The screen's mutations update reminders, and expo-notifications cannot load in Jest (Lesson 8.2)
jest.mock('@/notifications/reminders', () => ({ updateReminders: jest.fn() }));

startMockApi();
beforeEach(() => setSession(volunteer)); // Theo, who has a spot at today's cleanup (e17)
afterEach(() => queryClient.clear());

function showMyCleanups() {
  return renderScreens({ _layout: () => <Stack />, index: MyCleanupsScreen });
}

it('lists the cleanups Theo signed up for, each with a Cancel button', async () => {
  await showMyCleanups();
  expect(await screen.findByText('Tide Pool Morning Cleanup')).toBeOnTheScreen();
  expect(
    screen.getByRole('button', { name: 'Cancel my sign-up for Tide Pool Morning Cleanup' }),
  ).toBeOnTheScreen();
});

// The bug a volunteer reported: "I checked in, and my cleanup vanished from My cleanups"
it("keeps today's cleanup after check-in, marked Checked in, with nothing to cancel", async () => {
  await checkIn('e17', '6544'); // the code the organizer reads out at today's cleanup
  await showMyCleanups();
  expect(await screen.findByText('Tide Pool Morning Cleanup')).toBeOnTheScreen();
  expect(screen.getByText('Checked in')).toBeOnTheScreen();
  expect(
    screen.queryByRole('button', { name: 'Cancel my sign-up for Tide Pool Morning Cleanup' }),
  ).toBeNull();
});
