// Task 1: write the tests for BagCounter (src/BagCounter.tsx works: do not change it).
// Find everything the way a screen reader meets it: by role and name. Run: npm test
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
  // TODO 1a: render <Bags onChange={jest.fn()} /> (awaited), then expect the text '0 bags' and
  // the button named 'One bag fewer' to be disabled (toBeDisabled)
  throw new Error('TODO 1a: write this test');
});

it('counts one bag per press, as a finger would', async () => {
  // TODO 1b: press 'One more bag' twice with userEvent; expect '2 bags' and onChange called
  // exactly with 1, then 2 (mock.calls)
  throw new Error('TODO 1b: write this test');
});

it('keeps the decoration away from screen readers', async () => {
  // TODO 1c: the icon ♻ is not found by a plain getByText query (queryByText is null), but it
  // is there for a finger to see (includeHiddenElements: true)
  throw new Error('TODO 1c: write this test');
});

// Keep the imports used until you write the tests (delete these three lines then)
void render;
void screen;
void userEvent;
