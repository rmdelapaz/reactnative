// Tests (do not edit): npm test
import { render, screen } from '@testing-library/react-native';

import { CrewText } from './CrewText';
import { DebrisTally } from './DebrisTally';
import { colors } from './theme';
import { TideNotice } from './TideNotice';

describe('Task 1: the tide notice', () => {
  test('the heading has the heading color and size', async () => {
    await render(<TideNotice lowTide="6:40 AM" />);
    expect(screen.getByRole('header', { name: 'Check the tide' })).toHaveStyle({ color: colors.heading, fontSize: 20 });
  });

  test('the body text has a line height of 24', async () => {
    await render(<TideNotice lowTide="6:40 AM" />);
    expect(screen.getByText(/^Low tide at 6:40 AM/)).toHaveStyle({ fontSize: 16, lineHeight: 24 });
  });

  test('the small print is 14 units tall, a number', async () => {
    await render(<TideNotice lowTide="6:40 AM" />);
    expect(screen.getByText('Tide times from the harbor office')).toHaveStyle({ fontSize: 14 });
  });

  test('the box has 12 units of padding, a number', async () => {
    await render(<TideNotice lowTide="6:40 AM" />);
    expect(screen.getByTestId('tide-notice')).toHaveStyle({ padding: 12 });
  });
});

describe('Task 2: CrewText', () => {
  test('a label is small, muted and uppercase', async () => {
    await render(<CrewText variant="label">Meeting point</CrewText>);
    expect(screen.getByText('Meeting point')).toHaveStyle({ color: colors.textMuted, fontSize: 13, textTransform: 'uppercase' });
  });

  test('a warning is coral and bold', async () => {
    await render(<CrewText variant="warning">High surf today</CrewText>);
    expect(screen.getByText('High surf today')).toHaveStyle({ color: colors.warning, fontWeight: 'bold' });
  });

  test("the screen's own style wins over the variant", async () => {
    await render(
      <CrewText variant="label" style={{ color: colors.heading }}>
        Bring gloves
      </CrewText>,
    );
    expect(screen.getByText('Bring gloves')).toHaveStyle({ color: colors.heading, fontSize: 13 });
  });
});

describe('Task 3: the debris tally', () => {
  test('one line, with only the number bold', async () => {
    await render(<DebrisTally pieces={42} bags={3} />);
    expect(screen.getByText('42 pieces of debris in 3 bags')).toHaveStyle({ color: colors.text, fontSize: 16 });
    expect(screen.getByText('42')).toHaveStyle({ fontWeight: 'bold' });
  });

  test('one bag is a bag', async () => {
    await render(<DebrisTally pieces={7} bags={1} />);
    expect(screen.getByText('7 pieces of debris in 1 bag')).toBeOnTheScreen();
  });
});
