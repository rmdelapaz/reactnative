// Task 1 (reference): the tests for BagCounter, by role and name. Run: npm test
import { render, screen, userEvent } from '@testing-library/react-native';
import { useState } from 'react';

import { BagCounter } from './BagCounter';

// A screen's part that keeps the count, as a log form would. onChange records every change.
function Bags({ onChange }: { onChange: (count: number) => void }) {
  const [count, setCount] = useState(0);
  return (
    <BagCounter
      count={count}
      onChange={(next) => {
        setCount(next);
        onChange(next);
      }}
    />
  );
}

it('starts at no bags, with the minus button switched off', async () => {
  await render(<Bags onChange={jest.fn()} />);
  expect(screen.getByText('0 bags')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'One bag fewer' })).toBeDisabled();
});

it('counts one bag per press, as a finger would', async () => {
  const onChange = jest.fn();
  const user = userEvent.setup();
  await render(<Bags onChange={onChange} />);
  await user.press(screen.getByRole('button', { name: 'One more bag' }));
  await user.press(screen.getByRole('button', { name: 'One more bag' }));
  expect(screen.getByText('2 bags')).toBeOnTheScreen();
  expect(onChange.mock.calls).toEqual([[1], [2]]);
});

it('keeps the decoration away from screen readers', async () => {
  await render(<Bags onChange={jest.fn()} />);
  expect(screen.queryByText('♻')).toBeNull();
  expect(screen.getByText('♻', { includeHiddenElements: true })).toBeOnTheScreen();
});
