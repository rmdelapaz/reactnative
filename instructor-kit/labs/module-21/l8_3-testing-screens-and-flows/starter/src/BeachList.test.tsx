// Task 2: write the tests for BeachList's three faces (src/BeachList.tsx works: do not change it).
// The mock API in src/test/server.ts answers GET /api/sites with the course API's real answer.
import { render, screen, userEvent } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';

import { BeachList } from './BeachList';
import { API_URL, server, startMockApi } from './test/server';

startMockApi();

it('says it is loading, then lists every beach', async () => {
  // TODO 2a: render <BeachList apiUrl={API_URL} />; 'Loading beaches…' at once; then wait
  // (findBy...) for the header '6 beaches'; and 'Pelican Point Beach, Port Marisol' is listed
  throw new Error('TODO 2a: write this test');
});

it('says what went wrong as an alert, and tries again', async () => {
  // TODO 2b: make the API answer 503 ONCE (server.use, http.get, { once: true }); wait for the
  // alert 'Could not load the beaches (503).'; press 'Try again'; wait for '6 beaches'
  throw new Error('TODO 2b: write this test');
});

// Keep the imports used until you write the tests (delete these lines then)
void render;
void screen;
void userEvent;
void http;
void HttpResponse;
void server;
void BeachList;
void API_URL;
