// Tests (do not edit): npm test
import { render, screen, userEvent } from '@testing-library/react-native';

import sites from '../fixtures/sites.json';
import { BeachList } from './BeachList';
import { groupByTown, TownList } from './towns';
import type { Load, Site } from './types';

// The first render loads React Native's list code: seconds on a busy laptop
jest.setTimeout(30_000);

const all = sites as Site[];
const loaded: Load = { status: 'loaded', sites: all };
const noRetry = () => {};

test('Task 1: the search field keeps every letter you type', async () => {
  const user = userEvent.setup();
  await render(<BeachList load={loaded} columns={1} onRetry={noRetry} />);
  await user.type(screen.getByLabelText('Search beaches'), 'cove');
  expect(screen.getByLabelText('Search beaches')).toHaveDisplayValue('cove');
  expect(screen.getByRole('header', { name: 'Driftwood Cove' })).toBeOnTheScreen();
  expect(screen.queryByRole('header', { name: 'Long Strand Beach' })).not.toBeOnTheScreen();
});

test('Task 1: the list survives a wider window (one column, then two)', async () => {
  await render(<BeachList load={loaded} columns={1} onRetry={noRetry} />);
  await screen.rerender(<BeachList load={loaded} columns={2} onRetry={noRetry} />);
  expect(screen.getAllByRole('header')).toHaveLength(6);
});

test('Task 2: while loading: the search field and "Loading beaches…"', async () => {
  await render(<BeachList load={{ status: 'loading' }} columns={1} onRetry={noRetry} />);
  expect(screen.getByLabelText('Search beaches')).toBeOnTheScreen();
  expect(screen.getByText('Loading beaches…')).toBeOnTheScreen();
});

test('Task 2: after a failure: the message and a Try again that loads again', async () => {
  const user = userEvent.setup();
  const onRetry = jest.fn();
  await render(<BeachList load={{ status: 'failed', message: 'Could not reach the server.' }} columns={1} onRetry={onRetry} />);
  expect(screen.getByRole('alert')).toHaveTextContent('Could not reach the server.');
  await user.press(screen.getByRole('button', { name: 'Try again' }));
  expect(onRetry).toHaveBeenCalledTimes(1);
});

test('Task 2: nothing matches: the message, and Show all beaches clears the search', async () => {
  const user = userEvent.setup();
  await render(<BeachList load={loaded} columns={1} onRetry={noRetry} />);
  await user.type(screen.getByLabelText('Search beaches'), 'volcano');
  expect(screen.getByText('No beaches match your search.')).toBeOnTheScreen();
  await user.press(screen.getByRole('button', { name: 'Show all beaches' }));
  expect(screen.getByLabelText('Search beaches')).toHaveDisplayValue('');
  expect(screen.getAllByRole('header')).toHaveLength(6);
});

test('Task 3: groupByTown: three towns in alphabetical order, two beaches each', () => {
  const towns = groupByTown(all);
  expect(towns.map((town) => town.title)).toEqual(['Calder Bay', 'Port Marisol', 'Seal Rock']);
  expect(towns.map((town) => town.data.map((site) => site.id))).toEqual([
    ['sandpiper-flats', 'north-jetty'],
    ['pelican-point', 'driftwood-cove'],
    ['otter-creek', 'long-strand'],
  ]);
});

test('Task 3: the beaches under their towns: the towns are headings', async () => {
  await render(<TownList sites={all} />);
  expect(screen.getAllByRole('header').map((heading) => heading.props.children)).toEqual([
    'Calder Bay',
    'Port Marisol',
    'Seal Rock',
  ]);
  expect(screen.getByText('Otter Creek Mouth')).toBeOnTheScreen();
});
