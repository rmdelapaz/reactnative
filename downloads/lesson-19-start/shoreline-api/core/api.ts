// The Shoreline Crew API as one function: a web-standard Request in, a Response out.
// server.ts runs it with Node's http module; msw/handlers.ts runs the SAME code inside tests.
import {
  addDays, createSeed, DEBRIS_CATEGORIES, DEMO_PASSWORD, localDate, ORGANIZATION, SKILLS, TAGLINE, TIME_ZONE,
  toMinutes, type SeedData,
} from './seed.ts'
import type {
  ApiErrorBody, CleanupEvent, CleanupEventDetail, CleanupLog, DateString, DebrisCategory, ErrorCode, EventStatus,
  ImpactReport, ImpactTotals, Meta, Photo, RosterEntry, Signup, SignupStatus, Site, User, Volunteer,
} from './types.ts'

export const API_VERSION = '1.0.0'

export interface ApiOptions {
  /** the date the sample data is built around ("YYYY-MM-DD"); default: today in the group's time zone */
  today?: DateString
  /** extra delay before every answer, in ms: a number or a [min, max] range */
  latency?: number | [number, number]
  /** share of requests (0-1) that fail with 500, to practice error states */
  failRate?: number
  /** origins allowed to read responses besides http://localhost:* and http://127.0.0.1:*; ['*'] = any */
  corsOrigins?: string[]
  /** largest photo upload, in bytes (default 5 MB) */
  maxPhotoBytes?: number
}

type Params = Record<string, string>
interface Ctx {
  request: Request
  url: URL
  params: Params
  user: Volunteer | null
}
type Handler = (ctx: Ctx) => Response | Promise<Response>
interface Route {
  method: string
  path: string
  pattern: RegExp
  keys: string[]
  handler: Handler
}

class HttpError extends Error {
  status: number
  code: ErrorCode
  fieldErrors: Record<string, string[]> | undefined
  constructor(status: number, code: ErrorCode, message: string, fieldErrors?: Record<string, string[]>) {
    super(message)
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors
  }
}

const DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/
const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const DEV_TOKENS: Record<string, string> = { 'dev-organizer': 'v01', 'dev-volunteer': 'v04' }

/** A collector for field messages: f.add('title', 'Add a title.'); f.throwIfAny() */
class FieldErrors {
  errors: Record<string, string[]> = {}
  add(field: string, message: string) {
    ;(this.errors[field] ??= []).push(message)
  }
  get any() {
    return Object.keys(this.errors).length > 0
  }
  throwIfAny() {
    if (this.any) throw new HttpError(400, 'validation_failed', 'Some fields need attention.', this.errors)
  }
}

export function createApi(options: ApiOptions = {}) {
  const today = () => options.today ?? localDate(new Date(), TIME_ZONE)
  let db: SeedData = createSeed(today())
  let sessions = new Map<string, string>(Object.entries(DEV_TOKENS))
  let photos = new Map<string, Photo & { data: ArrayBuffer }>()
  let counter = 0
  const nextId = (prefix: string) => `${prefix}${Date.now().toString(36)}${(++counter).toString(36)}`
  const now = () => new Date().toISOString()

  // ------------------------------------------------------------------------------------------ helpers
  const isDate = (v: unknown): v is string => typeof v === 'string' && DATE.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`))
  const site = (id: string) => db.sites.find((s) => s.id === id)
  /** a site as the API sends it: the image URL made absolute for the address the request came to */
  const siteOut = (s: Site, ctx: Ctx): Site => ({ ...s, image: { ...s.image, url: new URL(s.image.url, ctx.url).href } })
  const volunteer = (id: string) => db.volunteers.find((v) => v.id === id)
  const holdsSpot = (s: Signup) => s.status === 'confirmed' || s.status === 'attended'
  const spotsTaken = (eventId: string) => db.signups.filter((s) => s.eventId === eventId && holdsSpot(s)).length

  function publicEvent(e: SeedData['events'][number]): CleanupEvent {
    const { checkInCode: _code, ...rest } = e
    return { ...rest, spotsTaken: spotsTaken(e.id) }
  }

  function findEvent(ctx: Ctx) {
    const e = db.events.find((x) => x.id === ctx.params.id)
    if (!e || (e.status === 'draft' && ctx.user?.role !== 'organizer')) {
      throw new HttpError(404, 'not_found', 'No cleanup event with that id.')
    }
    return e
  }

  function requireUser(ctx: Ctx): Volunteer {
    if (!ctx.user) throw new HttpError(401, 'unauthorized', 'Sign in first.')
    return ctx.user
  }

  function requireOrganizer(ctx: Ctx): Volunteer {
    const user = requireUser(ctx)
    if (user.role !== 'organizer') throw new HttpError(403, 'forbidden', 'Only organizers can do that.')
    return user
  }

  async function body(ctx: Ctx): Promise<Record<string, unknown>> {
    let data: unknown
    try {
      data = await ctx.request.json()
    } catch {
      throw new HttpError(400, 'validation_failed', 'The request body must be JSON.')
    }
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      throw new HttpError(400, 'validation_failed', 'The request body must be a JSON object.')
    }
    return data as Record<string, unknown>
  }

  function paginate<T>(ctx: Ctx, items: T[], defaultPer = 10, maxPer = 50) {
    const f = new FieldErrors()
    const q = ctx.url.searchParams
    const page = q.has('page') ? Number(q.get('page')) : 1
    const perPage = q.has('perPage') ? Number(q.get('perPage')) : defaultPer
    if (!Number.isInteger(page) || page < 1) f.add('page', 'page must be a whole number from 1.')
    if (!Number.isInteger(perPage) || perPage < 1 || perPage > maxPer) f.add('perPage', `perPage must be a whole number from 1 to ${maxPer}.`)
    f.throwIfAny()
    const total = items.length
    const totalPages = Math.max(1, Math.ceil(total / perPage))
    const slice = items.slice((page - 1) * perPage, page * perPage)
    const link = (p: number) => {
      const u = new URL(ctx.url)
      u.searchParams.set('page', String(p))
      u.searchParams.set('perPage', String(perPage))
      return `<${u.href}>`
    }
    const links = [`${link(1)}; rel="first"`]
    if (page > 1) links.push(`${link(Math.min(page - 1, totalPages))}; rel="prev"`)
    if (page < totalPages) links.push(`${link(page + 1)}; rel="next"`)
    links.push(`${link(totalPages)}; rel="last"`)
    return json(200, slice, {
      'X-Total-Count': String(total),
      'X-Total-Pages': String(totalPages),
      Link: links.join(', '),
    })
  }

  // ------------------------------------------------------------------------------------------ validation
  function checkEventFields(input: Record<string, unknown>, partial: boolean, current?: SeedData['events'][number]) {
    const f = new FieldErrors()
    const has = (k: string) => input[k] !== undefined
    const need = (k: string) => !partial || has(k)
    const str = (k: string) => (typeof input[k] === 'string' ? (input[k] as string).trim() : undefined)

    if (need('title')) {
      const t = str('title')
      if (!t) f.add('title', 'Add a title.')
      else if (t.length < 5) f.add('title', 'Use at least 5 characters for the title.')
      else if (t.length > 80) f.add('title', 'Keep the title to 80 characters or fewer.')
    }
    if (need('siteId') && !(typeof input.siteId === 'string' && site(input.siteId))) {
      f.add('siteId', 'Choose one of the cleanup sites.')
    }
    if (need('date')) {
      if (!isDate(input.date)) f.add('date', 'Enter a date as YYYY-MM-DD.')
      else if (!current && input.date < today()) f.add('date', 'Pick today or a later date.')
    }
    for (const k of ['startTime', 'endTime'] as const) {
      if (need(k) && !(typeof input[k] === 'string' && TIME.test(input[k] as string))) {
        f.add(k, 'Enter a time as HH:MM (24-hour clock).')
      }
    }
    const start = (has('startTime') ? input.startTime : current?.startTime) as string | undefined
    const end = (has('endTime') ? input.endTime : current?.endTime) as string | undefined
    if (start && end && TIME.test(start) && TIME.test(end) && toMinutes(end) <= toMinutes(start)) {
      f.add('endTime', 'The end time must be after the start time.')
    }
    if (need('capacity')) {
      const c = input.capacity
      if (typeof c !== 'number' || !Number.isInteger(c) || c < 1 || c > 200) {
        f.add('capacity', 'Capacity must be a whole number from 1 to 200.')
      } else if (current && c < spotsTaken(current.id)) {
        f.add('capacity', `${spotsTaken(current.id)} volunteers already hold a spot: capacity cannot be lower.`)
      }
    }
    if (need('meetingPoint')) {
      const m = str('meetingPoint')
      if (!m || m.length < 3) f.add('meetingPoint', 'Say where volunteers meet (at least 3 characters).')
      else if (m.length > 120) f.add('meetingPoint', 'Keep the meeting point to 120 characters or fewer.')
    }
    if (has('description') && (typeof input.description !== 'string' || input.description.length > 2000)) {
      f.add('description', 'The description must be text of 2000 characters or fewer.')
    }
    if (has('suppliesProvided')) {
      const s = input.suppliesProvided
      if (!Array.isArray(s) || s.length > 10 || s.some((x) => typeof x !== 'string' || !x.trim() || x.length > 40)) {
        f.add('suppliesProvided', 'Supplies must be a list of up to 10 short names.')
      }
    }
    if (has('status')) {
      const allowed: EventStatus[] = current ? ['draft', 'scheduled', 'completed', 'cancelled'] : ['draft', 'scheduled']
      if (!allowed.includes(input.status as EventStatus)) {
        f.add('status', `Status must be one of: ${allowed.join(', ')}.`)
      } else if (input.status === 'completed') {
        const date = (has('date') ? input.date : current?.date) as string
        if (date > today()) f.add('status', 'A cleanup can only be marked completed on or after its date.')
      }
    }
    f.throwIfAny()
  }

  function checkCounts(input: Record<string, unknown>, f: FieldErrors) {
    const items = input.items
    const ids = DEBRIS_CATEGORIES.map((c) => c.id as string)
    if (!Array.isArray(items)) {
      f.add('items', 'items must be a list of { category, count }.')
    } else {
      items.forEach((it: unknown, i) => {
        const o = it as { category?: unknown; count?: unknown } | null
        if (!o || typeof o.category !== 'string' || !ids.includes(o.category)) {
          f.add(`items.${i}.category`, 'Unknown debris category.')
        }
        if (!o || typeof o.count !== 'number' || !Number.isInteger(o.count) || o.count < 0 || o.count > 100000) {
          f.add(`items.${i}.count`, 'Count must be a whole number from 0 to 100000.')
        }
      })
    }
    if (typeof input.bags !== 'number' || !Number.isInteger(input.bags) || input.bags < 0 || input.bags > 500) {
      f.add('bags', 'Bags must be a whole number from 0 to 500.')
    }
    if (typeof input.weightKg !== 'number' || !(input.weightKg >= 0) || input.weightKg > 5000) {
      f.add('weightKg', 'Weight must be a number of kilograms from 0 to 5000.')
    }
    if (input.photoIds !== undefined && (!Array.isArray(input.photoIds) || input.photoIds.some((p) => typeof p !== 'string' || !photos.has(p)))) {
      f.add('photoIds', 'Upload each photo first and send the ids it returned.')
    }
  }

  // ------------------------------------------------------------------------------------------ routes
  const routes: Route[] = []
  function route(method: string, path: string, handler: Handler) {
    const keys: string[] = []
    const pattern = new RegExp('^' + path.replace(/:(\w+)/g, (_m, k: string) => {
      keys.push(k)
      return '([^/]+)'
    }) + '/?$')
    routes.push({ method, path, pattern, keys, handler })
  }

  route('GET', '/api', () => json(200, {
    name: 'Shoreline Crew API', version: API_VERSION,
    endpoints: routes.map((r) => `${r.method} ${r.path}`),
  }))
  route('GET', '/api/health', () => json(200, { ok: true, today: today() }))
  route('POST', '/api/_reset', () => {
    reset()
    return json(200, { ok: true, message: 'Sample data restored.' })
  })
  route('GET', '/api/meta', () => json(200, {
    organization: ORGANIZATION, tagline: TAGLINE, timeZone: TIME_ZONE, today: today(), skills: SKILLS,
    debrisCategories: DEBRIS_CATEGORIES, apiVersion: API_VERSION,
  } satisfies Meta))

  // auth
  route('POST', '/api/auth/sign-in', async (ctx) => {
    const input = await body(ctx)
    const f = new FieldErrors()
    if (typeof input.email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email)) f.add('email', 'Enter an email address.')
    if (typeof input.password !== 'string' || !input.password) f.add('password', 'Enter your password.')
    f.throwIfAny()
    const v = db.volunteers.find((x) => x.email.toLowerCase() === String(input.email).trim().toLowerCase())
    if (!v || input.password !== DEMO_PASSWORD) throw new HttpError(401, 'unauthorized', 'Email or password is incorrect.')
    const token = `st_${nextId('')}_${v.id}`
    sessions.set(token, v.id)
    return json(200, { token, user: toUser(v) })
  })
  route('POST', '/api/auth/sign-out', (ctx) => {
    const token = bearer(ctx.request)
    if (token && !DEV_TOKENS[token]) sessions.delete(token)
    return new Response(null, { status: 204 })
  })
  route('GET', '/api/auth/me', (ctx) => json(200, toUser(requireUser(ctx))))

  // sites
  route('GET', '/api/sites', (ctx) => json(200, db.sites.map((s) => siteOut(s, ctx))))
  route('GET', '/api/sites/:id', (ctx) => {
    const s = site(ctx.params.id ?? '')
    if (!s) throw new HttpError(404, 'not_found', 'No site with that id.')
    return json(200, siteOut(s, ctx))
  })

  // events
  route('GET', '/api/events', (ctx) => {
    const q = ctx.url.searchParams
    const f = new FieldErrors()
    const statuses: EventStatus[] = ['draft', 'scheduled', 'completed', 'cancelled']
    const status = q.get('status')
    if (status && !statuses.includes(status as EventStatus)) f.add('status', `status must be one of: ${statuses.join(', ')}.`)
    const when = q.get('when')
    if (when && when !== 'upcoming' && when !== 'past') f.add('when', 'when must be upcoming or past.')
    for (const k of ['from', 'to']) if (q.get(k) && !isDate(q.get(k))) f.add(k, `${k} must be a date as YYYY-MM-DD.`)
    const since = q.get('updatedSince')
    if (since && Number.isNaN(Date.parse(since))) f.add('updatedSince', 'updatedSince must be an ISO timestamp.')
    const sort = q.get('sort') ?? 'date'
    if (!['date', '-date', 'title'].includes(sort)) f.add('sort', 'sort must be date, -date or title.')
    const siteId = q.get('siteId')
    if (siteId && !site(siteId)) f.add('siteId', 'Unknown site.')
    f.throwIfAny()
    const words = (q.get('q') ?? '').toLowerCase().split(/\s+/).filter(Boolean)
    const organizer = ctx.user?.role === 'organizer'
    let list = db.events.filter((e) => organizer || e.status !== 'draft')
    if (status) list = list.filter((e) => e.status === status)
    if (siteId) list = list.filter((e) => e.siteId === siteId)
    if (when === 'upcoming') list = list.filter((e) => e.date >= today())
    if (when === 'past') list = list.filter((e) => e.date < today())
    const from = q.get('from'), to = q.get('to')
    if (from) list = list.filter((e) => e.date >= from)
    if (to) list = list.filter((e) => e.date <= to)
    if (since) list = list.filter((e) => Date.parse(e.updatedAt) > Date.parse(since))
    if (words.length) {
      list = list.filter((e) => {
        const text = `${e.title} ${e.description} ${site(e.siteId)?.name ?? ''}`.toLowerCase()
        return words.every((w) => text.includes(w))
      })
    }
    list = [...list].sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title)
      : (sort === '-date' ? -1 : 1) * `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))
    return paginate(ctx, list.map(publicEvent))
  })
  route('GET', '/api/events/:id', (ctx) => {
    const e = findEvent(ctx)
    const detail: CleanupEventDetail = { ...publicEvent(e), site: siteOut(site(e.siteId)!, ctx) }
    if (ctx.user?.role === 'organizer') detail.checkInCode = e.checkInCode
    return json(200, detail)
  })
  route('POST', '/api/events', async (ctx) => {
    requireOrganizer(ctx)
    const input = await body(ctx)
    checkEventFields(input, false)
    const t = now()
    const e: SeedData['events'][number] = {
      id: nextId('e'), title: String(input.title).trim(), siteId: String(input.siteId),
      status: (input.status as EventStatus | undefined) ?? 'draft', date: String(input.date),
      startTime: String(input.startTime), endTime: String(input.endTime), capacity: Number(input.capacity),
      spotsTaken: 0, meetingPoint: String(input.meetingPoint).trim(),
      description: typeof input.description === 'string' ? input.description : '',
      suppliesProvided: Array.isArray(input.suppliesProvided) ? input.suppliesProvided.map(String) : ['Gloves', 'Bags'],
      leadOrganizerId: ctx.user!.id, checkInCode: String(1000 + (counter * 7919) % 9000), createdAt: t, updatedAt: t,
    }
    db.events.push(e)
    return json(201, publicEvent(e), { Location: `/api/events/${e.id}` })
  })
  route('PATCH', '/api/events/:id', async (ctx) => {
    requireOrganizer(ctx)
    const e = findEvent(ctx)
    const input = await body(ctx)
    checkEventFields(input, true, e)
    for (const k of ['title', 'siteId', 'date', 'startTime', 'endTime', 'capacity', 'meetingPoint', 'description', 'suppliesProvided', 'status'] as const) {
      if (input[k] !== undefined) {
        const v = input[k]
        ;(e as unknown as Record<string, unknown>)[k] = typeof v === 'string' && k !== 'description' ? v.trim() : v
      }
    }
    e.updatedAt = now()
    return json(200, publicEvent(e))
  })
  route('DELETE', '/api/events/:id', (ctx) => {
    requireOrganizer(ctx)
    const e = findEvent(ctx)
    if (e.status !== 'draft') throw new HttpError(409, 'conflict', 'Only drafts can be deleted: cancel a scheduled cleanup instead.')
    db.events = db.events.filter((x) => x !== e)
    return new Response(null, { status: 204 })
  })

  // sign-ups
  route('GET', '/api/events/:id/signups', (ctx) => {
    requireOrganizer(ctx)
    const e = findEvent(ctx)
    const roster: RosterEntry[] = db.signups.filter((s) => s.eventId === e.id).map((s) => {
      const v = volunteer(s.volunteerId)!
      return { ...s, volunteer: { id: v.id, name: v.name, email: v.email, phone: v.phone, skills: v.skills } }
    }).sort((a, b) => a.volunteer.name.localeCompare(b.volunteer.name))
    return json(200, roster)
  })
  route('POST', '/api/events/:id/signups', async (ctx) => {
    const user = requireUser(ctx)
    const e = findEvent(ctx)
    const input = ctx.request.headers.get('content-length') === '0' ? {} : await body(ctx).catch(() => ({} as Record<string, unknown>))
    let who = user
    if (typeof input.volunteerId === 'string' && input.volunteerId !== user.id) {
      if (user.role !== 'organizer') throw new HttpError(403, 'forbidden', 'You can only sign yourself up.')
      const v = volunteer(input.volunteerId)
      if (!v) throw new HttpError(400, 'validation_failed', 'Some fields need attention.', { volunteerId: ['Unknown volunteer.'] })
      who = v
    }
    if (e.status !== 'scheduled' || e.date < today()) throw new HttpError(409, 'conflict', 'This cleanup is not open for sign-ups.')
    if (db.signups.some((s) => s.eventId === e.id && s.volunteerId === who.id && s.status !== 'cancelled')) {
      throw new HttpError(409, 'conflict', `${who.id === user.id ? 'You are' : `${who.name} is`} already signed up for this cleanup.`)
    }
    const note = typeof input.note === 'string' ? input.note.slice(0, 280) : ''
    const s: Signup = {
      id: nextId('s'), eventId: e.id, volunteerId: who.id, note, createdAt: now(), checkedInAt: null,
      status: spotsTaken(e.id) < e.capacity ? 'confirmed' : 'waitlisted',
    }
    db.signups.push(s)
    return json(201, s)
  })
  route('PATCH', '/api/signups/:id', async (ctx) => {
    const user = requireUser(ctx)
    const s = db.signups.find((x) => x.id === ctx.params.id)
    if (!s || (user.role !== 'organizer' && s.volunteerId !== user.id)) throw new HttpError(404, 'not_found', 'No sign-up with that id.')
    const input = await body(ctx)
    const statuses: SignupStatus[] = ['confirmed', 'waitlisted', 'cancelled', 'attended', 'no-show']
    if (!statuses.includes(input.status as SignupStatus)) {
      throw new HttpError(400, 'validation_failed', 'Some fields need attention.', { status: [`status must be one of: ${statuses.join(', ')}.`] })
    }
    if (user.role !== 'organizer' && input.status !== 'cancelled') throw new HttpError(403, 'forbidden', 'Volunteers can only cancel their own sign-up.')
    const wasHolding = holdsSpot(s)
    s.status = input.status as SignupStatus
    s.checkedInAt = s.status === 'attended' ? (s.checkedInAt ?? now()) : null
    const e = db.events.find((x) => x.id === s.eventId)
    if (e && wasHolding && !holdsSpot(s)) {
      // a spot opened: the first person on the waiting list gets it
      const next = db.signups.filter((x) => x.eventId === e.id && x.status === 'waitlisted').sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0]
      if (next && spotsTaken(e.id) < e.capacity) next.status = 'confirmed'
    }
    return json(200, s)
  })
  route('GET', '/api/me/signups', (ctx) => {
    const user = requireUser(ctx)
    const mine = db.signups.filter((s) => s.volunteerId === user.id).map((s) => {
      const e = db.events.find((x) => x.id === s.eventId)!
      return { ...s, event: publicEvent(e) }
    }).sort((a, b) => b.event.date.localeCompare(a.event.date))
    return json(200, mine)
  })
  route('POST', '/api/events/:id/check-in', async (ctx) => {
    const user = requireUser(ctx)
    const e = findEvent(ctx)
    const input = await body(ctx)
    const s = db.signups.find((x) => x.eventId === e.id && x.volunteerId === user.id && x.status !== 'cancelled')
    if (!s || s.status === 'waitlisted') throw new HttpError(409, 'conflict', 'You need a confirmed spot to check in.')
    if (e.date !== today() || e.status !== 'scheduled') throw new HttpError(409, 'conflict', 'Check-in opens on the day of the cleanup.')
    if (String(input.code ?? '').trim() !== e.checkInCode) {
      throw new HttpError(400, 'validation_failed', 'Some fields need attention.', { code: ['That code does not match. Ask the organizer for today\'s code.'] })
    }
    s.status = 'attended'
    s.checkedInAt ??= now()
    return json(200, s)
  })

  // logs (sent by the phone app)
  route('GET', '/api/events/:id/logs', (ctx) => {
    const user = requireUser(ctx)
    const e = findEvent(ctx)
    return json(200, db.logs.filter((l) => l.eventId === e.id && (user.role === 'organizer' || l.volunteerId === user.id)))
  })
  route('POST', '/api/events/:id/logs', async (ctx) => {
    const user = requireUser(ctx)
    const e = findEvent(ctx)
    const input = await body(ctx)
    const f = new FieldErrors()
    if (typeof input.clientId !== 'string' || input.clientId.length < 8 || input.clientId.length > 64) {
      f.add('clientId', 'clientId must be a unique string of 8-64 characters made on the device.')
    }
    checkCounts(input, f)
    if (typeof input.recordedAt !== 'string' || Number.isNaN(Date.parse(input.recordedAt))) f.add('recordedAt', 'recordedAt must be an ISO timestamp.')
    if (input.note !== undefined && (typeof input.note !== 'string' || input.note.length > 500)) f.add('note', 'Keep the note to 500 characters or fewer.')
    f.throwIfAny()
    const existing = db.logs.find((l) => l.volunteerId === user.id && l.clientId === input.clientId)
    if (existing) return json(200, existing)          // a retried upload: already saved
    if (!db.signups.some((s) => s.eventId === e.id && s.volunteerId === user.id && holdsSpot(s)) && user.role !== 'organizer') {
      throw new HttpError(403, 'forbidden', 'Only volunteers with a spot at this cleanup can log for it.')
    }
    if (e.date > today()) throw new HttpError(409, 'conflict', 'This cleanup has not happened yet.')
    const log: CleanupLog = {
      id: nextId('l'), clientId: String(input.clientId), eventId: e.id, volunteerId: user.id,
      items: (input.items as CleanupLog['items']).map((i) => ({ category: i.category, count: i.count })),
      bags: Number(input.bags), weightKg: Number(input.weightKg), note: typeof input.note === 'string' ? input.note : '',
      photoIds: Array.isArray(input.photoIds) ? input.photoIds.map(String) : [], recordedAt: String(input.recordedAt), createdAt: now(),
    }
    db.logs.push(log)
    return json(201, log)
  })

  // impact
  route('GET', '/api/events/:id/impact', (ctx) => {
    const e = findEvent(ctx)
    const r = db.reports.find((x) => x.eventId === e.id)
    if (!r) throw new HttpError(404, 'not_found', 'No impact report for this cleanup yet.')
    return json(200, r)
  })
  route('PUT', '/api/events/:id/impact', async (ctx) => {
    requireOrganizer(ctx)
    const e = findEvent(ctx)
    const input = await body(ctx)
    const f = new FieldErrors()
    const va = input.volunteersAttended
    if (typeof va !== 'number' || !Number.isInteger(va) || va < 0 || va > 1000) f.add('volunteersAttended', 'Volunteers must be a whole number from 0 to 1000.')
    checkCounts(input, f)
    if (input.notes !== undefined && (typeof input.notes !== 'string' || input.notes.length > 2000)) f.add('notes', 'Keep the notes to 2000 characters or fewer.')
    f.throwIfAny()
    if (e.date > today() || e.status === 'cancelled' || e.status === 'draft') {
      throw new HttpError(409, 'conflict', 'Impact can only be reported for a cleanup that has taken place.')
    }
    const report: ImpactReport = {
      eventId: e.id, volunteersAttended: Number(va), bags: Number(input.bags), weightKg: Number(input.weightKg),
      items: (input.items as ImpactReport['items']).map((i) => ({ category: i.category, count: i.count })),
      notes: typeof input.notes === 'string' ? input.notes : '',
      photoIds: Array.isArray(input.photoIds) ? input.photoIds.map(String) : [], submittedAt: now(),
    }
    db.reports = [...db.reports.filter((r) => r.eventId !== e.id), report]
    e.status = 'completed'
    e.updatedAt = now()
    return json(200, report)
  })
  route('GET', '/api/impact', (ctx) => {
    const q = ctx.url.searchParams
    const f = new FieldErrors()
    for (const k of ['from', 'to']) if (q.get(k) && !isDate(q.get(k))) f.add(k, `${k} must be a date as YYYY-MM-DD.`)
    f.throwIfAny()
    const from = q.get('from'), to = q.get('to')
    const rows = db.reports.map((r) => ({ r, e: db.events.find((x) => x.id === r.eventId)! }))
      .filter(({ e }) => (!from || e.date >= from) && (!to || e.date <= to))
      .sort((a, b) => a.e.date.localeCompare(b.e.date))
    const byCategory = Object.fromEntries(DEBRIS_CATEGORIES.map((c) => [c.id, 0])) as Record<DebrisCategory, number>
    const months = new Map<string, { month: string; events: number; weightKg: number }>()
    const sites = new Map<string, { siteId: string; events: number; weightKg: number }>()
    let hours = 0
    for (const { r, e } of rows) {
      for (const it of r.items) byCategory[it.category] += it.count
      const m = months.get(e.date.slice(0, 7)) ?? { month: e.date.slice(0, 7), events: 0, weightKg: 0 }
      m.events += 1
      m.weightKg = Math.round((m.weightKg + r.weightKg) * 10) / 10
      months.set(m.month, m)
      const s = sites.get(e.siteId) ?? { siteId: e.siteId, events: 0, weightKg: 0 }
      s.events += 1
      s.weightKg = Math.round((s.weightKg + r.weightKg) * 10) / 10
      sites.set(s.siteId, s)
      hours += r.volunteersAttended * (toMinutes(e.endTime) - toMinutes(e.startTime)) / 60
    }
    const totals: ImpactTotals = {
      from, to, events: rows.length, volunteerHours: Math.round(hours * 10) / 10,
      volunteersAttended: rows.reduce((n, { r }) => n + r.volunteersAttended, 0),
      bags: rows.reduce((n, { r }) => n + r.bags, 0),
      weightKg: Math.round(rows.reduce((n, { r }) => n + r.weightKg, 0) * 10) / 10,
      byCategory, byMonth: [...months.values()], bySite: [...sites.values()].sort((a, b) => b.weightKg - a.weightKg),
    }
    return json(200, totals)
  })

  // volunteers (organizers; a volunteer may read their own profile)
  route('GET', '/api/volunteers', (ctx) => {
    requireOrganizer(ctx)
    const q = ctx.url.searchParams
    const f = new FieldErrors()
    const skill = q.get('skill'), role = q.get('role')
    if (skill && !SKILLS.some((s) => s.id === skill)) f.add('skill', 'Unknown skill.')
    if (role && role !== 'organizer' && role !== 'volunteer') f.add('role', 'role must be organizer or volunteer.')
    f.throwIfAny()
    const words = (q.get('q') ?? '').toLowerCase().split(/\s+/).filter(Boolean)
    const list = db.volunteers
      .filter((v) => !skill || v.skills.includes(skill as Volunteer['skills'][number]))
      .filter((v) => !role || v.role === role)
      .filter((v) => words.every((w) => `${v.name} ${v.email}`.toLowerCase().includes(w)))
      .sort((a, b) => a.name.localeCompare(b.name))
    return paginate(ctx, list, 10, 50)
  })
  route('GET', '/api/volunteers/:id', (ctx) => {
    const user = requireUser(ctx)
    const v = volunteer(ctx.params.id ?? '')
    if (!v || (user.role !== 'organizer' && v.id !== user.id)) throw new HttpError(404, 'not_found', 'No volunteer with that id.')
    return json(200, v)
  })

  // photos
  route('POST', '/api/photos', async (ctx) => {
    const user = requireUser(ctx)
    const type = (ctx.request.headers.get('content-type') ?? '').split(';')[0]!.trim().toLowerCase()
    let data: ArrayBuffer
    let contentType: string
    if (type === 'multipart/form-data') {
      const form = await ctx.request.formData().catch(() => null)
      const file = form?.get('photo')
      if (!file || typeof file === 'string') {
        throw new HttpError(400, 'validation_failed', 'Some fields need attention.', { photo: ['Attach an image in a field named photo.'] })
      }
      contentType = file.type
      data = await file.arrayBuffer()
    } else {
      contentType = type
      data = await ctx.request.arrayBuffer()
    }
    if (!PHOTO_TYPES.includes(contentType)) {
      throw new HttpError(415, 'unsupported_media_type', 'Photos must be JPEG, PNG or WebP images.')
    }
    const max = options.maxPhotoBytes ?? 5 * 1024 * 1024
    if (data.byteLength > max) throw new HttpError(413, 'payload_too_large', `Photos must be ${Math.round(max / 1024 / 1024)} MB or smaller.`)
    if (data.byteLength === 0) throw new HttpError(400, 'validation_failed', 'Some fields need attention.', { photo: ['The image is empty.'] })
    const id = nextId('p')
    const photo: Photo = {
      id, url: new URL(`/api/photos/${id}`, ctx.url).href, contentType, bytes: data.byteLength, uploadedBy: user.id, createdAt: now(),
    }
    photos.set(id, { ...photo, data })
    return json(201, photo, { Location: `/api/photos/${id}` })
  })
  route('GET', '/api/photos/:id', (ctx) => {
    const p = photos.get(ctx.params.id ?? '')
    if (!p) throw new HttpError(404, 'not_found', 'No photo with that id.')
    return new Response(p.data, { status: 200, headers: { 'Content-Type': p.contentType, 'Cache-Control': 'max-age=3600' } })
  })

  // ------------------------------------------------------------------------------------------ plumbing
  function toUser(v: Volunteer): User {
    return { id: v.id, name: v.name, email: v.email, role: v.role }
  }

  function bearer(request: Request): string | null {
    const h = request.headers.get('authorization') ?? ''
    const m = /^Bearer\s+(\S+)$/i.exec(h)
    return m ? m[1]! : null
  }

  function cors(request: Request): Record<string, string> {
    const origin = request.headers.get('origin')
    const allowed = options.corsOrigins ?? []
    const h: Record<string, string> = { Vary: 'Origin' }
    if (origin && (allowed.includes('*') || allowed.includes(origin) || LOCAL_ORIGIN.test(origin))) {
      h['Access-Control-Allow-Origin'] = allowed.includes('*') ? '*' : origin
      h['Access-Control-Expose-Headers'] = 'X-Total-Count, X-Total-Pages, Link, Location'
    }
    return h
  }

  function json(status: number, data: unknown, headers: Record<string, string> = {}): Response {
    return new Response(JSON.stringify(data, null, 2), {
      status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        ...headers,
      },
    })
  }

  function errorResponse(status: number, code: ErrorCode, message: string, fieldErrors?: Record<string, string[]>) {
    const b: ApiErrorBody = { error: code, message }
    if (fieldErrors) b.fieldErrors = fieldErrors
    return json(status, b)
  }

  const STATUS_CODES: Record<number, ErrorCode> = {
    400: 'validation_failed', 401: 'unauthorized', 403: 'forbidden', 404: 'not_found', 405: 'method_not_allowed',
    409: 'conflict', 413: 'payload_too_large', 415: 'unsupported_media_type',
  }

  /** Answer one request (CORS headers added to every answer). */
  async function handle(request: Request): Promise<Response> {
    const res = await answer(request)
    for (const [k, v] of Object.entries(cors(request))) res.headers.set(k, v)
    return res
  }

  async function answer(request: Request): Promise<Response> {
    const url = new URL(request.url)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
          'Access-Control-Max-Age': '600',
        },
      })
    }
    const path = url.pathname === '/' ? '/api' : url.pathname
    const simulated = !['/api/health', '/api/_reset'].includes(path.replace(/\/$/, ''))
    // ?_delay=1500 and ?_status=500 change ONE request; the server's --latency and --fail-rate change all of them
    const delayParam = Number(url.searchParams.get('_delay') ?? '')
    let delay = Number.isFinite(delayParam) && delayParam > 0 ? Math.min(delayParam, 10000) : 0
    if (!delay && simulated && options.latency) {
      const [min, max] = Array.isArray(options.latency) ? options.latency : [options.latency, options.latency]
      delay = min + Math.random() * (max - min)
    }
    if (delay) await new Promise((r) => setTimeout(r, delay))
    const forced = Number(url.searchParams.get('_status') ?? '')
    if (forced >= 400 && forced <= 599) {
      return errorResponse(forced, STATUS_CODES[forced] ?? 'server_error', `Simulated ${forced} response (the _status parameter).`)
    }
    if (simulated && options.failRate && Math.random() < options.failRate) {
      return errorResponse(500, 'server_error', 'Simulated server error (the server was started with --fail-rate).')
    }
    const token = bearer(request)
    const userId = token ? sessions.get(token) : undefined
    const user = userId ? volunteer(userId) ?? null : null
    if (token && !user) return errorResponse(401, 'unauthorized', 'Your session has ended. Sign in again.')
    let pathMatched = false
    for (const r of routes) {
      const m = r.pattern.exec(path)
      if (!m) continue
      pathMatched = true
      if (r.method !== request.method && !(r.method === 'GET' && request.method === 'HEAD')) continue
      const params: Params = {}
      r.keys.forEach((k, i) => {
        params[k] = decodeURIComponent(m[i + 1] ?? '')
      })
      try {
        return await r.handler({ request, url, params, user })
      } catch (err) {
        if (err instanceof HttpError) return errorResponse(err.status, err.code, err.message, err.fieldErrors)
        console.error(err)
        return errorResponse(500, 'server_error', 'Something went wrong on the server.')
      }
    }
    if (pathMatched) {
      const allow = routes.filter((r) => r.pattern.test(path)).map((r) => r.method).join(', ')
      return json(405, { error: 'method_not_allowed', message: `Use ${allow} for this address.` } satisfies ApiErrorBody, { Allow: allow })
    }
    return errorResponse(404, 'not_found', `No API route for ${request.method} ${url.pathname}.`)
  }

  function reset() {
    db = createSeed(today())
    sessions = new Map(Object.entries(DEV_TOKENS))
    photos = new Map()
  }

  return {
    handle,
    reset,
    /** the live data (for tests): read it, do not keep references across reset() */
    get data(): Readonly<SeedData> {
      return db
    },
    routes: () => routes.map((r) => ({ method: r.method, path: r.path })),
  }
}

export type ShorelineApi = ReturnType<typeof createApi>
export { addDays, DEMO_PASSWORD }
