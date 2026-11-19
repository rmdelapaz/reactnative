import { http, HttpResponse } from 'msw';

import { ApiError, describeError, getItem, getItems, NetworkError, postItem } from '@/api/client';
import { API_URL, server, startMockApi } from '@/test/server';

startMockApi();

it('gets the items through the server address, checked', async () => {
  const items = await getItems();
  expect(items).toHaveLength(6);
  expect(await getItems('done')).toHaveLength(3);
});

it('turns error answers into ApiError, with the API message for people', async () => {
  const missing = await getItem('i99').catch((error: unknown) => error);
  expect(missing).toBeInstanceOf(ApiError);
  expect(describeError(missing)).toBe('This was not found. It may have been deleted.');

  const taken = await postItem({ name: 'Charge the tablet', note: null }).catch((error: unknown) => error);
  expect(describeError(taken)).toBe('There is already an item called "Charge the tablet".');
});

it('says which server did not answer', async () => {
  server.use(http.get(`${API_URL}/api/items`, () => HttpResponse.error()));
  const failure = await getItems().catch((error: unknown) => error);
  expect(failure).toBeInstanceOf(NetworkError);
  expect(describeError(failure)).toMatch(/^Could not reach the server at http:\/\/localhost:4000\./);
});

it('refuses an answer of the wrong shape', async () => {
  server.use(http.get(`${API_URL}/api/items/i1`, () => HttpResponse.json({ id: 'i1' })));
  await expect(getItem('i1')).rejects.toThrow('Unexpected data from GET /api/items/i1');
});

it('uses the mock API inside the app with EXPO_PUBLIC_API_URL=demo', async () => {
  const saved = process.env.EXPO_PUBLIC_API_URL;
  process.env.EXPO_PUBLIC_API_URL = 'demo';
  try {
    expect(await getItems('open')).toHaveLength(3); // no request: MSW would fail an unknown one
  } finally {
    process.env.EXPO_PUBLIC_API_URL = saved;
  }
});
