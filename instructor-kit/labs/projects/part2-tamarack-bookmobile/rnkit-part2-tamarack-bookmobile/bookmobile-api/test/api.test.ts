// The API's own tests: npm test (node --test). They call the core directly, no server needed.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createApi } from '../core/api.ts'

const BASE = 'http://localhost:4100'

async function call(api: ReturnType<typeof createApi>, method: string, path: string, body?: unknown, token?: string) {
  const headers = new Headers()
  if (body !== undefined) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await api.handle(new Request(BASE + path, { method, headers, body: body === undefined ? null : JSON.stringify(body) }))
  const text = await response.text()
  return { status: response.status, data: text ? JSON.parse(text) : null }
}

async function signIn(api: ReturnType<typeof createApi>, cardNumber = '21450021', pin = '4821') {
  const { data } = await call(api, 'POST', '/api/auth/sign-in', { cardNumber, pin })
  return data.token as string
}

test('health answers', async () => {
  const { status, data } = await call(createApi(), 'GET', '/api/health')
  assert.equal(status, 200)
  assert.deepEqual(data, { ok: true, name: 'bookmobile-api' })
})

test('eight stops, Monday first, in time order', async () => {
  const { data } = await call(createApi(), 'GET', '/api/stops')
  assert.equal(data.length, 8)
  assert.deepEqual(data.slice(0, 3).map((s: { id: string }) => s.id), ['s01', 's02', 's03'])
})

test('one stop, and 404 for an unknown id', async () => {
  const api = createApi()
  assert.equal((await call(api, 'GET', '/api/stops/s04')).data.name, 'Millrace Farmers Market')
  const missing = await call(api, 'GET', '/api/stops/s99')
  assert.equal(missing.status, 404)
  assert.equal(missing.data.error, 'not_found')
})

test('books: all twelve by title, and a search by title or author', async () => {
  const api = createApi()
  assert.equal((await call(api, 'GET', '/api/books')).data.length, 12)
  const found = await call(api, 'GET', '/api/books?q=FOX')
  assert.deepEqual(found.data.map((b: { id: string }) => b.id), ['b02'])
  assert.equal((await call(api, 'GET', '/api/books?q=ilves')).data[0].id, 'b01')
})

test('sign-in: 400 with field messages, 401 for a wrong PIN, 200 with a token', async () => {
  const api = createApi()
  const bad = await call(api, 'POST', '/api/auth/sign-in', { cardNumber: '123', pin: '' })
  assert.equal(bad.status, 400)
  assert.deepEqual(Object.keys(bad.data.fieldErrors), ['cardNumber', 'pin'])
  assert.equal((await call(api, 'POST', '/api/auth/sign-in', { cardNumber: '21450021', pin: '0000' })).status, 401)
  const ok = await call(api, 'POST', '/api/auth/sign-in', { cardNumber: '21450021', pin: '4821' })
  assert.equal(ok.status, 200)
  assert.equal(ok.data.patron.name, 'June Okafor')
})

test('holds need a sign-in', async () => {
  const api = createApi()
  assert.equal((await call(api, 'GET', '/api/holds')).status, 401)
  assert.equal((await call(api, 'POST', '/api/holds', { clientId: 'abcdefgh', bookId: 'b01', stopId: 's01' })).status, 401)
})

test('the same clientId twice is one hold (201, then 200)', async () => {
  const api = createApi()
  const token = await signIn(api)
  const hold = { clientId: 'phone-0001-abcd', bookId: 'b04', stopId: 's03' }
  const first = await call(api, 'POST', '/api/holds', hold, token)
  const again = await call(api, 'POST', '/api/holds', hold, token)
  assert.equal(first.status, 201)
  assert.equal(again.status, 200)
  assert.equal(again.data.id, first.data.id)
  assert.equal((await call(api, 'GET', '/api/holds', undefined, token)).data.length, 2)
})

test('a second hold on the same book is refused (409), and fields are checked (400)', async () => {
  const api = createApi()
  const token = await signIn(api)
  const dup = await call(api, 'POST', '/api/holds', { clientId: 'phone-0002-abcd', bookId: 'b09', stopId: 's01' }, token)
  assert.equal(dup.status, 409)
  assert.equal(dup.data.message, 'You already have a hold on this book.')
  const bad = await call(api, 'POST', '/api/holds', { clientId: 'x', bookId: 'b99', stopId: 's99', note: 'n'.repeat(121) }, token)
  assert.equal(bad.status, 400)
  assert.deepEqual(Object.keys(bad.data.fieldErrors), ['clientId', 'bookId', 'stopId', 'note'])
})

test('reset brings the sample holds back', async () => {
  const api = createApi()
  const token = await signIn(api)
  await call(api, 'POST', '/api/holds', { clientId: 'phone-0003-abcd', bookId: 'b01', stopId: 's01' }, token)
  await call(api, 'POST', '/api/_reset')
  assert.equal((await call(api, 'GET', '/api/holds', undefined, token)).data.length, 1)
})
