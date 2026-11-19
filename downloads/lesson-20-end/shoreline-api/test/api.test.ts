// node --test   (Node 24 runs these TypeScript files directly)
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { describe, it, beforeEach, after, before } from 'node:test'
import { createApi } from '../core/api.ts'
import type { ApiErrorBody, CleanupEvent, ImpactTotals, Signup, SignInResponse } from '../core/types.ts'

const TODAY = '2026-06-01'
const api = createApi({ today: TODAY })
const BASE = 'http://localhost:4000'

function call(method: string, path: string, opts: { token?: string; json?: unknown; headers?: Record<string, string> } = {}) {
  const headers: Record<string, string> = { ...opts.headers }
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`
  if (opts.json !== undefined) headers['Content-Type'] = 'application/json'
  return api.handle(new Request(BASE + path, {
    method, headers, body: opts.json === undefined ? null : JSON.stringify(opts.json),
  }))
}

async function signIn(email: string) {
  const res = await call('POST', '/api/auth/sign-in', { json: { email, password: 'shoreline-demo' } })
  assert.equal(res.status, 200)
  return (await res.json() as SignInResponse).token
}

describe('shoreline-api core', () => {
  beforeEach(() => api.reset())

  it('lists upcoming events soonest first with pagination headers', async () => {
    const res = await call('GET', '/api/events?when=upcoming&perPage=3')
    assert.equal(res.status, 200)
    assert.equal(res.headers.get('X-Total-Count'), '8')
    assert.equal(res.headers.get('X-Total-Pages'), '3')
    assert.match(res.headers.get('Link') ?? '', /rel="next"/)
    const events = await res.json() as CleanupEvent[]
    assert.deepEqual(events.map((e) => e.id), ['e17', 'e08', 'e09'])
    assert.equal(events[0]?.date, TODAY)
  })

  it('is deterministic for the same date', async () => {
    const a = createApi({ today: TODAY }).data
    const b = createApi({ today: TODAY }).data
    assert.deepEqual(a.signups, b.signups)
    assert.deepEqual(a.reports, b.reports)
  })

  it('hides drafts and check-in codes from the public', async () => {
    const pub = await (await call('GET', '/api/events?perPage=50')).json() as CleanupEvent[]
    assert.ok(!pub.some((e) => e.status === 'draft'))
    assert.equal((await call('GET', '/api/events/e15')).status, 404)
    const org = await (await call('GET', '/api/events/e15', { token: 'dev-organizer' })).json() as { checkInCode?: string }
    assert.match(org.checkInCode ?? '', /^\d{4}$/)
    const detail = await (await call('GET', '/api/events/e08')).json() as { checkInCode?: string; site: { name: string } }
    assert.equal(detail.checkInCode, undefined)
    assert.equal(detail.site.name, 'Driftwood Cove')
  })

  it('validates new events field by field', async () => {
    const res = await call('POST', '/api/events', { token: 'dev-organizer', json: { title: 'Hi', capacity: 0 } })
    assert.equal(res.status, 400)
    const body = await res.json() as ApiErrorBody
    assert.equal(body.error, 'validation_failed')
    assert.deepEqual(Object.keys(body.fieldErrors ?? {}).sort(),
      ['capacity', 'date', 'endTime', 'meetingPoint', 'siteId', 'startTime', 'title'])
  })

  it('creates, edits and deletes a draft (organizers only)', async () => {
    const draft = { title: 'Test Cleanup', siteId: 'long-strand', date: '2026-07-01', startTime: '09:00', endTime: '11:00', capacity: 5, meetingPoint: 'Main lot' }
    assert.equal((await call('POST', '/api/events', { json: draft })).status, 401)
    assert.equal((await call('POST', '/api/events', { token: 'dev-volunteer', json: draft })).status, 403)
    const res = await call('POST', '/api/events', { token: 'dev-organizer', json: draft })
    assert.equal(res.status, 201)
    const made = await res.json() as CleanupEvent
    assert.equal(made.status, 'draft')
    const edited = await (await call('PATCH', `/api/events/${made.id}`, { token: 'dev-organizer', json: { capacity: 8 } })).json() as CleanupEvent
    assert.equal(edited.capacity, 8)
    assert.equal((await call('DELETE', `/api/events/${made.id}`, { token: 'dev-organizer' })).status, 204)
    assert.equal((await call('DELETE', '/api/events/e08', { token: 'dev-organizer' })).status, 409)
  })

  it('signs in, waitlists when full and promotes from the waiting list', async () => {
    const zoe = await signIn('zoe.castillo@example.com')
    const bad = await call('POST', '/api/auth/sign-in', { json: { email: 'zoe.castillo@example.com', password: 'nope' } })
    assert.equal(bad.status, 401)
    const me = await (await call('GET', '/api/auth/me', { token: zoe })).json() as { role: string }
    assert.equal(me.role, 'volunteer')
    const roster = api.data.signups.filter((s) => s.eventId === 'e08')
    const waiting = roster.filter((s) => s.status === 'waitlisted')
    assert.ok(waiting.length >= 2)
    if (!roster.some((s) => s.volunteerId === 'v24' && s.status !== 'cancelled')) {
      const s = await (await call('POST', '/api/events/e08/signups', { token: zoe, json: {} })).json() as Signup
      assert.equal(s.status, 'waitlisted')
    }
    const confirmed = roster.find((s) => s.status === 'confirmed')!
    await call('PATCH', `/api/signups/${confirmed.id}`, { token: 'dev-organizer', json: { status: 'cancelled' } })
    assert.equal(api.data.signups.find((s) => s.id === waiting[0]!.id)?.status, 'confirmed')
  })

  it('checks in on the day with the right code only', async () => {
    const ev = api.data.events.find((e) => e.id === 'e17')!
    const s = api.data.signups.find((x) => x.eventId === 'e17' && x.status === 'confirmed')!
    const who = api.data.volunteers.find((v) => v.id === s.volunteerId)!
    const token = await signIn(who.email)
    const wrong = await call('POST', '/api/events/e17/check-in', { token, json: { code: '0000' } })
    assert.equal(wrong.status, 400)
    const ok = await call('POST', '/api/events/e17/check-in', { token, json: { code: ev.checkInCode } })
    assert.equal((await ok.json() as Signup).status, 'attended')
  })

  it('saves a phone log once even when the upload is retried', async () => {
    const s = api.data.signups.find((x) => x.eventId === 'e07' && x.status === 'attended')!
    const token = await signIn(api.data.volunteers.find((v) => v.id === s.volunteerId)!.email)
    const log = { clientId: 'phone-123456', items: [{ category: 'glass', count: 3 }], bags: 1, weightKg: 1.5, recordedAt: '2026-05-20T18:00:00Z' }
    const first = await call('POST', '/api/events/e07/logs', { token, json: log })
    const again = await call('POST', '/api/events/e07/logs', { token, json: log })
    assert.equal(first.status, 201)
    assert.equal(again.status, 200)
    assert.equal(api.data.logs.filter((l) => l.clientId === 'phone-123456').length, 1)
  })

  it('totals impact from the reports', async () => {
    const t = await (await call('GET', '/api/impact')).json() as ImpactTotals
    assert.equal(t.events, 6)
    assert.equal(t.byMonth.reduce((n, m) => n + m.events, 0), 6)
    assert.ok(t.weightKg > 0 && t.bags > 0 && t.volunteerHours > 0)
  })

  it('stores photos and rejects other files', async () => {
    const token = 'dev-volunteer'
    const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
    const form = new FormData()
    form.append('photo', new Blob([png], { type: 'image/png' }), 'tiny.png')
    const res = await api.handle(new Request(BASE + '/api/photos', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form }))
    assert.equal(res.status, 201)
    const photo = await res.json() as { id: string; bytes: number }
    assert.equal(photo.bytes, 8)
    const text = await api.handle(new Request(BASE + '/api/photos', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'text/plain' }, body: 'hi' }))
    assert.equal(text.status, 415)
  })

  it('answers CORS for local origins only', async () => {
    const local = await call('GET', '/api/sites', { headers: { Origin: 'http://localhost:5173' } })
    assert.equal(local.headers.get('Access-Control-Allow-Origin'), 'http://localhost:5173')
    const other = await call('GET', '/api/sites', { headers: { Origin: 'https://example.com' } })
    assert.equal(other.headers.get('Access-Control-Allow-Origin'), null)
  })

  it('simulates one failure or delay on request', async () => {
    assert.equal((await call('GET', '/api/events?_status=500')).status, 500)
    const t = Date.now()
    await call('GET', '/api/meta?_delay=200')
    assert.ok(Date.now() - t >= 190)
  })
})

describe('server.ts', () => {
  const port = 4900 + Math.floor(Math.random() * 90)
  let child: ReturnType<typeof spawn>
  before(async () => {
    child = spawn(process.execPath, ['server.ts', `--port=${port}`, '--quiet', `--today=${TODAY}`], { cwd: new URL('..', import.meta.url) })
    for (let i = 0; i < 50; i++) {
      try {
        if ((await fetch(`http://localhost:${port}/api/health`)).ok) return
      } catch { /* not up yet */ }
      await new Promise((r) => setTimeout(r, 100))
    }
    throw new Error('server did not start')
  })
  after(() => child.kill())

  it('serves the same API over HTTP', async () => {
    const res = await fetch(`http://localhost:${port}/api/events?status=completed&perPage=2`)
    assert.equal(res.status, 200)
    assert.equal(res.headers.get('x-total-count'), '6')
    const sites = await (await fetch(`http://localhost:${port}/api/sites`)).json() as unknown[]
    assert.equal(sites.length, 6)
  })
})
