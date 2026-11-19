// The Bookmobile API itself: web-standard Request in, Response out, so the same code answers the
// node server (server.ts) and the tests (msw/handlers.ts). The data lives in memory.
import { books, patrons, seedHolds, stops } from './seed.ts'
import type { ApiErrorBody, Book, ErrorCode, Hold, Patron, SignInResponse, Stop } from './types.ts'

export interface ApiOptions {
  latency?: number // milliseconds to wait before every answer
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const HOLD_LIMIT = 5

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })
}

function problem(status: number, error: ErrorCode, message: string, fieldErrors?: Record<string, string[]>): Response {
  const body: ApiErrorBody = fieldErrors ? { error, message, fieldErrors } : { error, message }
  return json(status, body)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const byDayAndTime = (a: Stop, b: Stop) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.start.localeCompare(b.start)

export function createApi(options: ApiOptions = {}) {
  let holds = seedHolds()
  let nextHold = 2
  const sessions = new Map<string, Patron>()
  let nextToken = 1

  function reset() {
    holds = seedHolds()
    nextHold = 2
  }

  function publicHold({ patronId: _patronId, ...hold }: Hold & { patronId: string }): Hold {
    return hold
  }

  function patronFor(request: Request): Patron | undefined {
    const auth = request.headers.get('Authorization') ?? ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    return sessions.get(token)
  }

  async function readJSON(request: Request): Promise<unknown> {
    try {
      return await request.json()
    } catch {
      return undefined
    }
  }

  async function route(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/+$/, '')
    const method = request.method.toUpperCase()

    if (method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })

    if (method === 'GET' && path === '/api/health') return json(200, { ok: true, name: 'bookmobile-api' })

    if (method === 'POST' && path === '/api/_reset') {
      reset()
      return json(200, { ok: true })
    }

    if (method === 'GET' && path === '/api/stops') return json(200, [...stops].sort(byDayAndTime))

    const stopMatch = /^\/api\/stops\/([^/]+)$/.exec(path)
    if (method === 'GET' && stopMatch) {
      const id = decodeURIComponent(stopMatch[1] ?? '')
      const stop = stops.find((s) => s.id === id)
      return stop ? json(200, stop) : problem(404, 'not_found', `No stop with the id ${id}.`)
    }

    if (method === 'GET' && path === '/api/books') {
      const q = (url.searchParams.get('q') ?? '').trim().toLowerCase()
      const audience = url.searchParams.get('audience')
      const found: Book[] = books
        .filter((b) => !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
        .filter((b) => !audience || b.audience === audience)
        .sort((a, b) => a.title.localeCompare(b.title))
      return json(200, found)
    }

    if (method === 'POST' && path === '/api/auth/sign-in') {
      const body = await readJSON(request)
      const cardNumber = isRecord(body) && typeof body.cardNumber === 'string' ? body.cardNumber : ''
      const pin = isRecord(body) && typeof body.pin === 'string' ? body.pin : ''
      const fieldErrors: Record<string, string[]> = {}
      if (!/^\d{8}$/.test(cardNumber)) fieldErrors.cardNumber = ['Enter the 8-digit number on your library card.']
      if (!/^\d{4}$/.test(pin)) fieldErrors.pin = ['Enter your 4-digit PIN.']
      if (Object.keys(fieldErrors).length > 0) return problem(400, 'validation_error', 'Some fields need attention.', fieldErrors)
      const found = patrons.find((p) => p.cardNumber === cardNumber && p.pin === pin)
      if (!found) return problem(401, 'unauthorized', 'That card number and PIN do not match our records.')
      const patron: Patron = { id: found.id, name: found.name, cardNumber: found.cardNumber }
      const token = `bookmobile-${found.id}-${nextToken++}`
      sessions.set(token, patron)
      const answer: SignInResponse = { token, patron }
      return json(200, answer)
    }

    if (method === 'POST' && path === '/api/auth/sign-out') {
      const auth = request.headers.get('Authorization') ?? ''
      sessions.delete(auth.replace(/^Bearer /, ''))
      return new Response(null, { status: 204, headers: CORS })
    }

    if (path === '/api/holds' && (method === 'GET' || method === 'POST')) {
      const patron = patronFor(request)
      if (!patron) return problem(401, 'unauthorized', 'Sign in to see and place holds.')
      const mine = holds.filter((h) => h.patronId === patron.id)
      if (method === 'GET') return json(200, mine.map(publicHold))

      const body = await readJSON(request)
      if (!isRecord(body)) return problem(400, 'validation_error', 'Send the hold as JSON.')
      const fieldErrors: Record<string, string[]> = {}
      const clientId = typeof body.clientId === 'string' ? body.clientId : ''
      if (!/^[A-Za-z0-9-]{8,64}$/.test(clientId)) fieldErrors.clientId = ['clientId must be 8 to 64 letters, digits or dashes.']
      const book = books.find((b) => b.id === body.bookId)
      if (!book) fieldErrors.bookId = ['No book with that id.']
      const stop = stops.find((s) => s.id === body.stopId)
      if (!stop) fieldErrors.stopId = ["Choose one of the bookmobile's stops."]
      const note = body.note === undefined ? '' : body.note
      if (typeof note !== 'string' || note.trim().length > 120) fieldErrors.note = ['Keep the note to 120 characters or fewer.']
      if (Object.keys(fieldErrors).length > 0 || !book || !stop || typeof note !== 'string') {
        return problem(400, 'validation_error', 'Some fields need attention.', fieldErrors)
      }
      // The same clientId again: the phone is resending a hold the API already has (its answer got lost)
      const same = holds.find((h) => h.clientId === clientId)
      if (same) {
        return same.patronId === patron.id ? json(200, publicHold(same)) : problem(409, 'conflict', 'That hold id is already in use.')
      }
      if (mine.some((h) => h.bookId === book.id)) return problem(409, 'already_held', 'You already have a hold on this book.')
      if (mine.length >= HOLD_LIMIT) return problem(409, 'hold_limit', `You can have up to ${HOLD_LIMIT} holds at a time.`)
      const hold = {
        id: `h${String(nextHold++).padStart(2, '0')}`,
        clientId,
        patronId: patron.id,
        bookId: book.id,
        bookTitle: book.title,
        stopId: stop.id,
        stopName: stop.name,
        note: note.trim(),
        status: 'requested' as const,
      }
      holds.push(hold)
      return json(201, publicHold(hold))
    }

    return problem(404, 'not_found', `No such endpoint: ${method} ${path || '/'}`)
  }

  async function handle(request: Request): Promise<Response> {
    if (options.latency) await new Promise((resolve) => setTimeout(resolve, options.latency))
    return route(request)
  }

  return { handle, reset }
}
