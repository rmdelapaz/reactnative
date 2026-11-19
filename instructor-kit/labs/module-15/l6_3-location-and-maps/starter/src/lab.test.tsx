// Tests (do not edit): npm test
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, userEvent } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { API } from './kitApi';
import { mapLinkFor } from './mapLink';
import { PickupForm } from './PickupForm';
import { type Position, van, vanLabel } from './types';
import { vanHint } from './vanHint';
import { VanMap } from './VanMap';

// No map under Jest: a stand-in for react-native-maps that only remembers what MapView was given
const mockMapProps: { showsUserLocation?: boolean }[] = [];
jest.mock('react-native-maps', () => ({
  __esModule: true,
  default: (props: { showsUserLocation?: boolean }) => {
    mockMapProps.push(props);
    return null;
  },
  Marker: () => null,
}));

// A position `north` meters north of the van, measured to within `accuracy` meters
const at = (north: number, accuracy: number | null): Position => ({
  coords: { latitude: van.latitude + north / 111_195, longitude: van.longitude, accuracy },
});

test('Task 1: 60 m away, measured to 10 m: the van is here', () => {
  expect(vanHint(at(60, 10), van)).toEqual({ kind: 'here', text: 'The van is right here.' });
});

test('Task 1: 900 m away: about 900 m', () => {
  expect(vanHint(at(900, 20), van)).toEqual({ kind: 'near', text: 'The van is about 900 m away.' });
});

test('Task 1: the wrong beach, 6.2 km away: far', () => {
  expect(vanHint(at(6200, 30), van).kind).toBe('far');
});

test('Task 1: under the cliff, a 400 m circle: unsure, never "here"', () => {
  expect(vanHint(at(40, 400), van)).toEqual({
    kind: 'unsure',
    text: 'Your phone is not sure where you are. Look for the van at the car park.',
  });
});

test('Task 1: no accuracy at all: unsure', () => {
  expect(vanHint(at(40, null), van).kind).toBe('unsure');
});

test('Task 2: an iPhone link names the place, encoded', () => {
  expect(mapLinkFor('ios', van, vanLabel)).toBe(
    'https://maps.apple.com/?ll=36.9791,-122.1185&q=Supply%20van%2C%20Otter%20Creek%20car%20park',
  );
});

test('Task 2: an Android geo: link puts the pin at the place, with its label', () => {
  expect(mapLinkFor('android', van, vanLabel)).toBe(
    'geo:36.9791,-122.1185?q=36.9791,-122.1185(Supply%20van%2C%20Otter%20Creek%20car%20park)',
  );
});

test('Task 2: the web preview opens OpenStreetMap', () => {
  expect(mapLinkFor('web', van, vanLabel)).toBe(
    'https://www.openstreetmap.org/?mlat=36.9791&mlon=-122.1185#map=16/36.9791/-122.1185',
  );
});

test('Task 2: the blue dot only after a yes', async () => {
  await render(<VanMap van={van} label={vanLabel} locationAllowed={false} />);
  expect(mockMapProps.at(-1)?.showsUserLocation).toBeFalsy();
  await render(<VanMap van={van} label={vanLabel} locationAllowed />);
  expect(mockMapProps.at(-1)?.showsUserLocation).toBe(true);
});

// The practice server: kit k-07's code is 0427; kit k-09 is for a cleanup that is not today
const codes: string[] = [];
let status: 'ready' | 'picked-up' = 'ready';
const server = setupServer(
  http.get(`${API}/api/kits/:id`, ({ params }) =>
    HttpResponse.json({ id: params.id, label: 'Kit 7: gloves, grabber, two bags', status }),
  ),
  http.post(`${API}/api/kits/:id/pickup`, async ({ params, request }) => {
    const { code } = (await request.json()) as { code: unknown };
    codes.push(String(code));
    if (params.id === 'k-09') {
      return HttpResponse.json({ error: 'conflict', message: 'Pickup opens on the day of the cleanup.' }, { status: 409 });
    }
    if (code !== '0427') {
      return HttpResponse.json(
        {
          error: 'validation_failed',
          message: 'Some fields need attention.',
          fieldErrors: { code: ['That code does not match the tag on this kit.'] },
        },
        { status: 400 },
      );
    }
    status = 'picked-up';
    return HttpResponse.json({ id: params.id, label: 'Kit 7: gloves, grabber, two bags', status });
  }),
);
const unhandled: string[] = [];
beforeAll(() =>
  server.listen({
    onUnhandledFrame({ frame, defaults }) {
      const { data } = frame;
      const request =
        typeof data === 'object' && data !== null && 'request' in data && data.request instanceof Request
          ? data.request
          : undefined;
      unhandled.push(request ? `${request.method} ${request.url}` : frame.protocol);
      defaults.error();
    },
  }),
);
beforeEach(() => {
  codes.length = 0;
  status = 'ready';
});
afterEach(() => {
  const missed = unhandled.splice(0);
  if (missed.length) throw new Error(`No MSW handler for: ${missed.join(', ')}`);
  server.resetHandlers();
});
afterAll(() => server.close());

async function openForm(kitId: string) {
  // no retries, and no clean-up timers left running when the tests end (gcTime)
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false, gcTime: Infinity } },
  });
  await render(
    <QueryClientProvider client={client}>
      <PickupForm kitId={kitId} />
    </QueryClientProvider>,
  );
  await screen.findByText('Type the 4-digit code on the tag.');
  const user = userEvent.setup();
  return {
    pickUp: async (code: string) => {
      await user.type(screen.getByLabelText('Code on the tag'), code);
      await user.press(screen.getByRole('button', { name: 'Pick up' }));
    },
  };
}

test('Task 3: two digits is not a code: the form says so and asks nobody', async () => {
  const form = await openForm('k-07');
  await form.pickUp('12');
  expect(await screen.findByText('Enter the 4-digit code on the tag.')).toBeOnTheScreen();
  expect(codes).toEqual([]);
});

test('Task 3: a wrong code: the server\'s words, for the code field', async () => {
  const form = await openForm('k-07');
  await form.pickUp('1234');
  expect(await screen.findByText('That code does not match the tag on this kit.')).toBeOnTheScreen();
});

test('Task 3: the code with a leading zero: sent as it is, and the screen shows the kit picked up', async () => {
  const form = await openForm('k-07');
  await form.pickUp('0427');
  expect(await screen.findByText('Kit 7: gloves, grabber, two bags: picked up. Have a good cleanup!')).toBeOnTheScreen();
  expect(codes).toEqual(['0427']);
});

test('Task 3: not the day yet: the server\'s words for the whole form', async () => {
  const form = await openForm('k-09');
  await form.pickUp('0427');
  expect(await screen.findByText('Pickup opens on the day of the cleanup.')).toBeOnTheScreen();
});
