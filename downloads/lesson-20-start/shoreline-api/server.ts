// Shoreline Crew API: a small mock back end for the course apps. No dependencies: Node 24 or newer runs
// this TypeScript file directly.
//
//   node server.ts                         http://localhost:4000/api
//   node server.ts --latency=800           wait 800 ms before every answer (or a range: --latency=300-1500)
//   node server.ts --fail-rate=0.2         about 1 request in 5 fails with 500
//   node server.ts --port=4100             another port (or PORT=4100)
//   node server.ts --host                  also reachable from other devices on your network (phones)
//   node server.ts --today=2026-06-01      build the sample data around another date
//   node server.ts --cors=https://my-hq.netlify.app   let a deployed site read the API
//
// The data lives in memory: restart the server (or POST /api/_reset) to get the sample data back.
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { networkInterfaces } from 'node:os'
import { createApi, type ApiOptions } from './core/api.ts'

function flag(name: string): string | undefined {
  const hit = process.argv.slice(2).find((a) => a === `--${name}` || a.startsWith(`--${name}=`))
  if (hit === undefined) return undefined
  return hit.includes('=') ? hit.slice(hit.indexOf('=') + 1) : ''
}

function fail(message: string): never {
  console.error(`shoreline-api: ${message}`)
  process.exit(1)
}

const known = ['port', 'host', 'latency', 'fail-rate', 'today', 'cors', 'quiet', 'help']
for (const a of process.argv.slice(2)) {
  const name = a.replace(/^--/, '').split('=')[0] ?? ''
  if (!a.startsWith('--') || !known.includes(name)) fail(`unknown option ${a} (options: ${known.map((k) => '--' + k).join(' ')})`)
}
if (flag('help') !== undefined) {
  console.log('Usage: node server.ts [--port=4000] [--host] [--latency=MS|MIN-MAX] [--fail-rate=0-1] [--today=YYYY-MM-DD] [--cors=ORIGIN,...] [--quiet]')
  process.exit(0)
}

const port = Number(flag('port') || process.env.PORT || 4000)
if (!Number.isInteger(port) || port < 1 || port > 65535) fail('--port must be a number from 1 to 65535')
const hostFlag = flag('host')
const host = hostFlag === undefined ? 'localhost' : hostFlag || '0.0.0.0'
const options: ApiOptions = {}
const latency = flag('latency')
if (latency) {
  const [min, max] = latency.split('-').map(Number)
  if (min === undefined || Number.isNaN(min) || (max !== undefined && Number.isNaN(max))) fail('--latency must be milliseconds, like 800 or 300-1500')
  options.latency = max === undefined ? min : [min, max]
}
const failRate = flag('fail-rate')
if (failRate) {
  options.failRate = Number(failRate)
  if (!(options.failRate >= 0 && options.failRate <= 1)) fail('--fail-rate must be a number from 0 to 1, like 0.2')
}
const today = flag('today')
if (today) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) fail('--today must be a date as YYYY-MM-DD')
  options.today = today
}
const corsList = flag('cors')
if (corsList) options.corsOrigins = corsList.split(',').map((o) => o.trim()).filter(Boolean)
const quiet = flag('quiet') !== undefined

const api = createApi(options)
const publicDir = new URL('./public/', import.meta.url)
const types: Record<string, string> = { jpg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml', webp: 'image/webp' }

/** The site pictures in public/images/ (the only files the server serves). */
async function staticFile(path: string) {
  if (!/^\/images\/[a-z0-9/-]+\.(jpg|png|svg|webp)$/.test(path)) return null
  try {
    return { data: await readFile(new URL('.' + path, publicDir)), type: types[path.split('.').pop() ?? ''] ?? 'application/octet-stream' }
  } catch {
    return null
  }
}

const server = createServer(async (req, res) => {
  const started = performance.now()
  try {
    const chunks: Buffer[] = []
    for await (const chunk of req) chunks.push(chunk as Buffer)
    const headers = new Headers()
    for (const [k, v] of Object.entries(req.headers)) {
      if (v !== undefined) headers.set(k, Array.isArray(v) ? v.join(', ') : v)
    }
    const method = req.method ?? 'GET'
    const file = method === 'GET' || method === 'HEAD' ? await staticFile((req.url ?? '/').split('?')[0] ?? '/') : null
    if (file) {
      res.writeHead(200, { 'Content-Type': file.type, 'Cache-Control': 'max-age=3600', 'Access-Control-Allow-Origin': '*' })
      res.end(method === 'HEAD' ? undefined : file.data)
      if (!quiet) console.log(`${method} ${req.url} 200 ${Math.round(performance.now() - started)} ms`)
      return
    }
    const request = new Request(`http://${req.headers.host ?? `localhost:${port}`}${req.url ?? '/'}`, {
      method,
      headers,
      body: method === 'GET' || method === 'HEAD' || chunks.length === 0 ? null : Buffer.concat(chunks),
    })
    const response = await api.handle(request)
    res.writeHead(response.status, Object.fromEntries(response.headers))
    res.end(method === 'HEAD' ? undefined : Buffer.from(await response.arrayBuffer()))
    if (!quiet) {
      console.log(`${method} ${req.url} ${response.status} ${Math.round(performance.now() - started)} ms`)
    }
  } catch (err) {
    console.error(err)
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end('{"error":"server_error","message":"Something went wrong on the server."}')
  }
})

server.on('error', (err: Error & { code?: string }) => {
  if (err.code === 'EADDRINUSE') fail(`port ${port} is already in use. Is the API already running in another terminal? Or start it with --port=4100`)
  fail(err.message)
})

server.listen(port, host, () => {
  console.log(`Shoreline Crew API running at http://localhost:${port}/api`)
  if (host === '0.0.0.0') {
    for (const list of Object.values(networkInterfaces())) {
      for (const a of list ?? []) {
        if (a.family === 'IPv4' && !a.internal) console.log(`  on your network:  http://${a.address}:${port}/api`)
      }
    }
  }
  const extras = [
    options.latency !== undefined ? `latency ${latency} ms` : '',
    options.failRate ? `fail rate ${options.failRate}` : '',
    options.today ? `today = ${options.today}` : '',
  ].filter(Boolean)
  if (extras.length) console.log(`  simulating: ${extras.join(', ')}`)
  console.log('  sample sign-in: maya.okafor@example.com (organizer) or theo.nakamura@example.com (volunteer), password shoreline-demo')
  console.log('Press Ctrl+C to stop.')
})
