// The café's acceptance tests (do not edit): npm test. The type tests are in src/types.check.ts (npm run typecheck).
import { render, screen, userEvent } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Queue from './app/index';
import { TicketCard } from './components/TicketCard';
import { tickets } from './data/tickets';
import type { Ticket } from './types';
import { categoryLabels, countLabel, filterTickets, groupByCategory, statusLabels } from './utils/tickets';

// The first render of the whole screen loads React Native's list and switch code: seconds on a busy laptop
jest.setTimeout(30_000);

const ticket = (id: string): Ticket => {
  const found = tickets.find((t) => t.id === id);
  if (!found) throw new Error(`no ticket ${id}`);
  return found;
};
// A phone's safe areas (a notch at the top, the home indicator at the bottom), as on a real phone
const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } };
const onPhone = (ui: ReactElement) => render(<SafeAreaProvider initialMetrics={metrics}>{ui}</SafeAreaProvider>);

// ---------------------------------------------------------------- TODO B: the words and the rules
test('B1: a label for every table and every status', () => {
  expect(Object.values(categoryLabels)).toEqual(['Electronics', 'Clothing and bags', 'Bikes', 'Furniture']);
  expect(Object.values(statusLabels)).toEqual(['Waiting', 'In repair', 'Fixed', "Can't be fixed"]);
});

test('B2: search matches the item or the owner, ignoring case and spaces', () => {
  expect(filterTickets(tickets, '  BIKE ', false).map((t) => t.id)).toEqual(['t04', 't08']);
  expect(filterTickets(tickets, 'hana', false).map((t) => t.item)).toEqual(['Wool sweater']);
  expect(filterTickets(tickets, '', false)).toHaveLength(12);
});

test('B3: hiding finished repairs leaves out fixed and unfixable ones', () => {
  expect(filterTickets(tickets, '', true).map((t) => t.number)).toEqual([2, 3, 4, 5, 8, 10, 11, 12]);
  expect(countLabel(8, 12)).toBe('8 of 12 tickets');
  expect(countLabel(12, 12)).toBe('12 tickets');
});

test('B4: the tickets under their tables, in hall order, empty tables left out', () => {
  expect(groupByCategory(tickets).map((s) => [s.title, s.data.length])).toEqual([
    ['Electronics', 5], ['Clothing and bags', 3], ['Bikes', 2], ['Furniture', 2],
  ]);
  expect(groupByCategory(filterTickets(tickets, 'bike', false)).map((s) => s.title)).toEqual(['Bikes']);
});

// ---------------------------------------------------------------- TODO C: the ticket card
test('C1: the card shows the item as a heading, its tag, the owner, the status and the fixer', async () => {
  await onPhone(<TicketCard ticket={ticket('t02')} onMarkFixed={() => {}} />);
  expect(screen.getByRole('header', { name: 'Toaster' })).toBeOnTheScreen();
  expect(screen.getByText('#2')).toBeOnTheScreen();
  expect(screen.getByText('Electronics · brought by Wen')).toBeOnTheScreen();
  expect(screen.getByText('In repair')).toBeOnTheScreen();
  expect(screen.getByText('Fixer: Ade')).toBeOnTheScreen();
});

test('C2: a waiting ticket has no fixer line and no Mark fixed button', async () => {
  await onPhone(<TicketCard ticket={ticket('t03')} onMarkFixed={() => {}} />);
  expect(screen.getByText('Waiting')).toBeOnTheScreen();
  expect(screen.queryByText(/^Fixer:/)).not.toBeOnTheScreen();
  expect(screen.queryByRole('button', { name: /fixed/ })).not.toBeOnTheScreen();
});

test('C3: Show problem opens the problem and says it is expanded', async () => {
  const user = userEvent.setup();
  await onPhone(<TicketCard ticket={ticket('t03')} onMarkFixed={() => {}} />);
  const toggle = screen.getByRole('button', { name: 'Show problem: Denim jacket' });
  expect(toggle).toBeCollapsed();
  await user.press(toggle);
  expect(screen.getByText('A torn pocket and a missing button.')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'Hide problem: Denim jacket' })).toBeExpanded();
});

test('C4: Mark fixed tells the screen which ticket', async () => {
  const user = userEvent.setup();
  const onMarkFixed = jest.fn();
  await onPhone(<TicketCard ticket={ticket('t11')} onMarkFixed={onMarkFixed} />);
  await user.press(screen.getByRole('button', { name: 'Mark fixed: Backpack' }));
  expect(onMarkFixed).toHaveBeenCalledWith('t11');
});

// ---------------------------------------------------------------- TODO D: the queue screen
test('D1: the queue: banner, search, two switches and the count', async () => {
  await onPhone(<Queue />);
  expect(screen.getByRole('header', { name: 'Fix-It Tables' })).toBeOnTheScreen();
  expect(screen.getByLabelText('Search repairs')).toBeOnTheScreen();
  expect(screen.getByRole('switch', { name: 'Hide finished repairs' })).toBeOnTheScreen();
  expect(screen.getByRole('switch', { name: 'Group by table' })).toBeOnTheScreen();
  expect(screen.getByText('12 tickets')).toBeOnTheScreen();
});

test('D2: typing a search keeps every letter and filters the list', async () => {
  const user = userEvent.setup();
  await onPhone(<Queue />);
  await user.type(screen.getByLabelText('Search repairs'), 'bike');
  expect(screen.getByLabelText('Search repairs')).toHaveDisplayValue('bike');
  expect(screen.getByText('2 of 12 tickets')).toBeOnTheScreen();
  expect(screen.getByRole('header', { name: 'Road bike' })).toBeOnTheScreen();
  expect(screen.queryByRole('header', { name: 'Toaster' })).not.toBeOnTheScreen();
});

test('D3: nothing matches: the message, and Show all repairs brings everything back', async () => {
  const user = userEvent.setup();
  await onPhone(<Queue />);
  await user.press(screen.getByRole('switch', { name: 'Hide finished repairs' }));
  await user.type(screen.getByLabelText('Search repairs'), 'piano');
  expect(screen.getByText('No repairs match your search.')).toBeOnTheScreen();
  await user.press(screen.getByRole('button', { name: 'Show all repairs' }));
  expect(screen.getByLabelText('Search repairs')).toHaveDisplayValue('');
  expect(screen.getByRole('switch', { name: 'Hide finished repairs' })).not.toBeChecked();
  expect(screen.getByText('12 tickets')).toBeOnTheScreen();
});

test('D4: Mark fixed changes the ticket, and a hidden finished ticket leaves the list', async () => {
  const user = userEvent.setup();
  await onPhone(<Queue />);
  await user.press(screen.getByRole('switch', { name: 'Hide finished repairs' }));
  expect(screen.getByText('8 of 12 tickets')).toBeOnTheScreen();
  await user.press(screen.getByRole('button', { name: 'Mark fixed: Toaster' }));
  expect(screen.getByText('7 of 12 tickets')).toBeOnTheScreen();
  expect(screen.queryByRole('header', { name: 'Toaster' })).not.toBeOnTheScreen();
});

test('D5: Group by table shows the tables as headings, empty tables left out', async () => {
  const user = userEvent.setup();
  await onPhone(<Queue />);
  await user.press(screen.getByRole('switch', { name: 'Group by table' }));
  expect(screen.getByRole('header', { name: 'Electronics' })).toBeOnTheScreen();
  expect(screen.getByRole('header', { name: 'Table lamp' })).toBeOnTheScreen();
  await user.type(screen.getByLabelText('Search repairs'), 'bike');
  const tables = screen.getAllByRole('header').map((h) => h.props.children).filter((t) => Object.values(categoryLabels).includes(t));
  expect(tables).toEqual(['Bikes']);
});
