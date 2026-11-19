// The Bookmobile API: a small mock back end for the Bookmobile Stops app. No dependencies: Node 24 or
// newer runs this TypeScript file directly. You never need to edit it.
//
//   node server.ts                 http://localhost:4100/api
//   node server.ts --host          also reachable from a phone on the same Wi-Fi (Lesson 5.1)
//   node server.ts --latency=800   wait 800 ms before every answer (to see the loading faces)
//   node server.ts --port=4200     another port
//   node server.ts --quiet         no line per request
//
// The data lives in memory: restart the server (or POST /api/_reset) to get the sample data back.
// Sign-ins live in memory too: after a restart the app's token is unknown (401) and you sign in again.
import { createServer } from 'node:http'
import { networkInterfaces } from 'node:os'
import { createApi, type ApiOptions } from './core/api.ts'

function flag(name: string): string | undefined {
  const hit = process.argv.slice(2).find((a) => a === `--${name}` || a.startsWith(`--${name}=`))
  if (hit === undefined) return undefined
  return hit.includes('=') ? hit.slice(hit.indexOf('=') + 1) : ''
}

function fail(message: string): never {
  console.error(`bookmobile-api: ${message}`)
  process.exit(1)
}

const known = ['port', 'host', 'latency', 'quiet', 'help']
for (const a of process.argv.slice(2)) {
  const name = a.replace(/^--/, '').split('=')[0] ?? ''
  if (!a.startsWith('--') || !known.includes(name)) fail(`unknown option ${a} (options: ${known.map((k) => '--' + k).join(' ')})`)
}
if (flag('help') !== undefined) {
  console.log('Usage: node server.ts [--port=4100] [--host] [--latency=MS] [--quiet]')
  process.exit(0)
}

const port = Number(flag('port') || process.env.PORT || 4100)
if (!Number.isInteger(port) || port < 1 || port > 65535) fail('--port must be a number from 1 to 65535')
const host = flag('host') === undefined ? 'localhost' : '0.0.0.0'
const options: ApiOptions = {}
const latency = flag('latency')
if (latency) {
  options.latency = Number(latency)
  if (!Number.isInteger(options.latency) || options.latency < 0) fail('--latency must be milliseconds, like 800')
}
const quiet = flag('quiet') !== undefined
const api = createApi(options)

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
    const request = new Request(`http://${req.headers.host ?? `localhost:${port}`}${req.url ?? '/'}`, {
      method,
      headers,
      body: method === 'GET' || method === 'HEAD' || chunks.length === 0 ? null : Buffer.concat(chunks),
    })
    const response = await api.handle(request)
    res.writeHead(response.status, Object.fromEntries(response.headers))
    res.end(method === 'HEAD' ? undefined : Buffer.from(await response.arrayBuffer()))
    if (!quiet) console.log(`${method} ${req.url} ${response.status} ${Math.round(performance.now() - started)} ms`)
  } catch (err) {
    console.error(err)
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end('{"error":"server_error","message":"Something went wrong on the server."}')
  }
})

server.on('error', (err: Error & { code?: string }) => {
  if (err.code === 'EADDRINUSE') fail(`port ${port} is already in use. Is the API already running in another terminal? Or start it with --port=4200`)
  fail(err.message)
})

server.listen(port, host, () => {
  console.log(`Bookmobile API running at http://localhost:${port}/api`)
  if (host === '0.0.0.0') {
    for (const list of Object.values(networkInterfaces())) {
      for (const net of list ?? []) {
        if (net.family === 'IPv4' && !net.internal) console.log(`  on your network: http://${net.address}:${port}/api`)
      }
    }
  }
  if (!quiet) console.log('Try http://localhost:' + port + '/api/stops   (Ctrl+C stops the server)')
})
