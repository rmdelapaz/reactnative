import { NotificationFeedbackType, notificationAsync } from 'expo-haptics';

import { changeSettings } from '@/state/settings';
import { feel } from '@/utils/haptics';

// An automatic mock keeps the module's plain values (NotificationFeedbackType.Success is still
// 'success') and swaps every function for one that does nothing and answers undefined
jest.mock('expo-haptics');
const buzz = jest.mocked(notificationAsync);

// feel() calls .catch() on what notificationAsync gives back: give it a Promise
beforeEach(() => buzz.mockResolvedValue());
afterEach(() => buzz.mockClear());

// jest-expo runs the tests as an iPhone (Platform.OS is 'ios'): the iPhone's kind of buzz
it('buzzes "success" when something went through', () => {
  changeSettings({ hapticsOn: true });
  feel('success');
  expect(buzz).toHaveBeenCalledWith(NotificationFeedbackType.Success);
});

it('stays still when the volunteer turned buzzing off', () => {
  changeSettings({ hapticsOn: false });
  feel('error');
  expect(buzz).not.toHaveBeenCalled();
});
