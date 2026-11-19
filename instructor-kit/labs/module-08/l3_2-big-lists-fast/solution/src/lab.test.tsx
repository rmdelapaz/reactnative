// Tests (do not edit): npm test
import { act, render, renderHook, screen, userEvent, waitFor } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import page1 from '../fixtures/past-page-1.json';
import page2 from '../fixtures/past-page-2.json';
import page3 from '../fixtures/past-page-3.json';
import { CleanupRow } from './CleanupRow';
import { flattenByMonth, headingIndices, PastList } from './months';
import type { PastCleanup } from './types';
import { usePastCleanups } from './usePastCleanups';

// The first render loads FlashList and React Native's list code: seconds on a busy laptop
jest.setTimeout(30_000);

const API = 'http://api.test';
const pages: PastCleanup[][] = [page1, page2, page3];
const all = pages.flat();

// MSW answers like shoreline-api: three cleanups a page, the totals in the headers. It also notes every page asked for.
let asked: number[] = [];
let failPage = 0;
let holdPage = 0;
let release: () => void = () => {};
let extra: PastCleanup | undefined; // a cleanup that "moved" to the next page while the volunteer scrolled
const server = setupServer(
  http.get(`${API}/api/events`, async ({ request }) => {
    const page = Number(new URL(request.url).searchParams.get('page'));
    asked.push(page);
    if (page === holdPage) {
      await new Promise<void>((resolve) => (release = resolve)); // on its way until the test says so
    }
    if (page === failPage) {
      return HttpResponse.json({ error: 'server_error' }, { status: 500 });
    }
    const items = page === 2 && extra ? [extra, ...pages[1]] : pages[page - 1];
    return HttpResponse.json(items, { headers: { 'X-Total-Count': '7', 'X-Total-Pages': '3' } });
  }),
);
// MSW 3 calls the option onUnhandledFrame. A request no handler answers fails the test it came from.
const unhandled: string[] = [];
beforeAll(() =>
  server.listen({
    onUnhandledFrame({ frame, defaults }) {
      const { data } = frame; // unknown: narrow it before reading the request
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
  asked = [];
  failPage = 0;
  holdPage = 0;
  extra = undefined;
});
afterEach(() => {
  const missed = unhandled.splice(0);
  if (missed.length) throw new Error(`No MSW handler for: ${missed.join(', ')}`);
});
afterAll(() => server.close());

const titles = (load: ReturnType<typeof usePastCleanups>['load']) =>
  load.status === 'loaded' ? load.cleanups.map((cleanup) => cleanup.id) : [];

test('Task 1: a recycled row does not keep the last cleanup\'s report open', async () => {
  const user = userEvent.setup();
  await render(<CleanupRow cleanup={all[0]} />);
  await user.press(screen.getByRole('button', { name: 'Show report' }));
  expect(screen.getByText('10 volunteers came.')).toBeOnTheScreen();
  // What FlashList does when it recycles: the SAME row component, handed another cleanup
  await screen.rerender(<CleanupRow cleanup={all[4]} />);
  expect(screen.getByRole('button', { name: 'Show report' })).toBeOnTheScreen();
});

test('Task 2: near the end twice while page 2 is on its way: page 2 is asked for once', async () => {
  const { result } = await renderHook(() => usePastCleanups(API));
  await waitFor(() => expect(result.current.load.status).toBe('loaded'));
  holdPage = 2;
  await act(async () => result.current.onEndReached());
  expect(result.current.more.status).toBe('loading');
  await act(async () => result.current.onEndReached()); // FlashList checks the end again while page 2 is on its way
  release();
  await waitFor(() => expect(titles(result.current.load)).toHaveLength(6));
  expect(asked).toEqual([1, 2]);
});

test('Task 2: page 2 fails: the list stops asking until Try again', async () => {
  failPage = 2;
  const { result } = await renderHook(() => usePastCleanups(API));
  await waitFor(() => expect(result.current.load.status).toBe('loaded'));
  await act(async () => result.current.onEndReached());
  await waitFor(() => expect(result.current.more.status).toBe('failed'));
  // The volunteer is still at the end: FlashList checks again, and again
  await act(async () => {
    result.current.onEndReached();
    result.current.onEndReached();
  });
  expect(asked).toEqual([1, 2]);
  failPage = 0;
  await act(async () => result.current.loadNextPage()); // the footer's Try again
  await waitFor(() => expect(titles(result.current.load)).toHaveLength(6));
  expect(asked).toEqual([1, 2, 2]);
});

test('Task 2: a cleanup that moved to page 2 is not shown twice', async () => {
  extra = all[2]; // the last cleanup of page 1, sent again at the top of page 2
  const { result } = await renderHook(() => usePastCleanups(API));
  await waitFor(() => expect(result.current.load.status).toBe('loaded'));
  await act(async () => result.current.onEndReached());
  await waitFor(() => expect(result.current.more.status).toBe('idle'));
  await waitFor(() => expect(titles(result.current.load)).toEqual(['e01', 'e02', 'e03', 'e04', 'e05', 'e06']));
});

test('Task 3: one heading before the first cleanup of each month', () => {
  const rows = flattenByMonth(all);
  expect(rows.map((row) => (row.kind === 'heading' ? row.title : row.cleanup.id))).toEqual([
    'January', 'e01', 'February', 'e02', 'March', 'e03', 'April', 'e04', 'May', 'e05', 'e06', 'June', 'e07',
  ]);
  expect(headingIndices(rows)).toEqual([0, 2, 4, 6, 8, 11]);
});

test('Task 3: the months are headings in the FlashList', async () => {
  await render(<PastList cleanups={all.slice(0, 3)} />);
  // FlashList also draws a pinned copy of the current heading: count each month once
  const months = new Set(screen.getAllByRole('header').map((heading) => heading.props.children));
  expect([...months]).toEqual(['January', 'February', 'March']);
  expect(screen.getByText('Marsh Boardwalk Cleanup')).toBeOnTheScreen();
});
