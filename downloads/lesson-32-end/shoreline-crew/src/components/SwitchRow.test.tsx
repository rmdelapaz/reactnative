import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';
import { useState } from 'react';

import { SwitchRow } from '@/components/SwitchRow';

// A screen's part: SwitchRow shows the value it is given, so the test keeps it in state, as
// the Cleanups screen does. onChange records every change the row reports.
function GroupByDate({ onChange }: { onChange: (value: boolean) => void }) {
  const [on, setOn] = useState(false);
  return (
    <SwitchRow
      label="Group by date"
      value={on}
      onValueChange={(value) => {
        setOn(value);
        onChange(value);
      }}
    />
  );
}

it('is one switch, named by its words, as a screen reader meets it', async () => {
  await render(<GroupByDate onChange={jest.fn()} />);
  expect(screen.getByRole('switch', { name: 'Group by date' })).not.toBeChecked();
  // The words on the left are hidden from screen readers, so the queries skip them too
  expect(screen.queryByText('Group by date')).toBeNull();
});

it('flips exactly once for a tap on the switch or on the words', async () => {
  const onChange = jest.fn();
  const user = userEvent.setup();
  await render(<GroupByDate onChange={onChange} />);
  const toggle = screen.getByRole('switch', { name: 'Group by date' });

  await user.press(toggle); // a finger on the switch itself
  expect(onChange.mock.calls).toEqual([[true]]);
  expect(toggle).toBeChecked();

  await user.press(screen.getByText('Group by date', { includeHiddenElements: true }));
  expect(onChange.mock.calls).toEqual([[true], [false]]);
  expect(toggle).not.toBeChecked();
});

it('flips once when a screen reader turns the switch itself', async () => {
  const onChange = jest.fn();
  await render(<GroupByDate onChange={onChange} />);
  // A double-tap with VoiceOver or TalkBack flips the phone's own switch, which reports it
  await fireEvent(screen.getByRole('switch', { name: 'Group by date' }), 'valueChange', true);
  expect(onChange.mock.calls).toEqual([[true]]);
});
