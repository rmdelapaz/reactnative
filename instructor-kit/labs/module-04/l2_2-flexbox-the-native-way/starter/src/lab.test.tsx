// Tests (do not edit): npm test. Jest cannot measure a layout, so these tests read the flexbox styles of each box.
import { render, screen } from '@testing-library/react-native';

import sites from '../fixtures/sites.json';
import { FactRow } from './FactRow';
import { SitePanel } from './SitePanel';
import { SiteHeader } from './SiteHeader';
import { siteTags, TagRow } from './TagRow';
import type { Site } from './types';

const site = (id: string) => sites.find((s) => s.id === id) as Site;

test('Task 1: the header row puts the town at the far end, lined up with the name', async () => {
  await render(<SiteHeader site={site('north-jetty')} />);
  expect(screen.getByTestId('site-header')).toHaveStyle({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  });
  expect(screen.getByRole('header', { name: 'North Jetty' })).toHaveStyle({ flexShrink: 1 });
  expect(screen.getByText('Calder Bay')).toBeOnTheScreen();
});

test('Task 2: the label keeps 88 and the value takes the rest of the row', async () => {
  await render(<FactRow label="Parking" value={site('sandpiper-flats').parking} />);
  expect(screen.getByTestId('label-Parking')).toHaveStyle({ width: 88 });
  expect(screen.getByTestId('value-Parking')).toHaveStyle({ flex: 1 });
});

test('Task 3: the tags come from the real beaches', () => {
  expect(siteTags(site('pelican-point'))).toEqual(['Sand', 'Step-free access', 'Free parking']);
  expect(siteTags(site('north-jetty'))).toEqual(['Rocky', 'Free parking']);
  expect(siteTags(site('otter-creek'))).toEqual(['Mixed']);
});

test('Task 3: the tags sit in a wrapping row', async () => {
  await render(<TagRow tags={['Sand', 'Step-free access']} />);
  expect(screen.getByTestId('tag-row')).toHaveStyle({ flexDirection: 'row', flexWrap: 'wrap' });
});

test('the panel shows all three parts', async () => {
  await render(<SitePanel site={site('long-strand')} />);
  expect(screen.getByRole('header', { name: 'Long Strand Beach' })).toBeOnTheScreen();
  expect(screen.getByText('Step-free access')).toBeOnTheScreen();
  expect(screen.getByTestId('value-Parking')).toHaveTextContent(/State beach lot/);
});
