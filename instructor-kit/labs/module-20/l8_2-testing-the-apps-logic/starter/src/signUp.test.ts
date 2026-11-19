// Task 3 (edit THIS file, not signUp.ts): MSW answers the request in place of shoreline-api, with the answers
// the real API gave (fixtures/signups.json, saved once from shoreline-api). No server runs.
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import answers from './fixtures/signups.json';
import { signUp } from './signUp';

const api = 'http://localhost:4000';
const signups = `${api}/api/events/:id/signups`;

// By default the API says yes (201), as it did for a cleanup Theo had no spot at yet
const server = setupServer(http.post(signups, () => HttpResponse.json(answers.signedUp.body, { status: 201 })));
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function todo(task: string): never {
  throw new Error(`TODO ${task}`);
}

it('signs the volunteer up', async () => {
  expect(await signUp(api, 'dev-volunteer', 'e09')).toEqual({ kind: 'signed-up', status: 'confirmed' });
});

it("passes on the server's own words when the volunteer already has a spot", async () => {
  todo('3a: make the API answer this test with answers.alreadySignedUp (409), with server.use()');
  expect(await signUp(api, 'dev-volunteer', 'e08')).toEqual({ kind: 'refused', message: 'You are already signed up for this cleanup.' });
});

it('asks for a new sign-in when the API does not know the token', async () => {
  todo('3b: make the API answer this test with answers.signInEnded (401)');
  expect(await signUp(api, 'a-token-the-api-forgot', 'e10')).toEqual({ kind: 'sign-in-ended' });
});

it('reports "no answer" when the connection drops', async () => {
  todo('3c: make the request fail like a dropped connection (MSW: HttpResponse.error())');
  expect(await signUp(api, 'dev-volunteer', 'e09')).toEqual({ kind: 'no-answer' });
});
