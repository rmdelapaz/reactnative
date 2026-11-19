// Environment check for React Native & Expo: Build and Ship a Mobile App (Session 1 of the instructor kit)
//
// Run it from your course folder (the one that holds shoreline-api and shoreline-crew), with the API running:
//   node labs/module-01/l1_0-orientation/check_environment.mjs
//   node labs/module-01/l1_0-orientation/check_environment.mjs http://localhost:4000    (another API address)
//   ... --metro-port=8090      (the port for the short development-server test; default: any free port)
// It changes nothing in your code. It reads your folder, asks the API three questions, starts the development server
// for a moment on a spare port (like your first `npx expo start`, that writes Expo's generated type files) and asks
// it to bundle the app for the web preview, then runs tsc and the linter in shoreline-crew.
// Last line: READY, READY WITH NOTES, or NOT READY (then fix the FIX lines and run it again).
// Plain JavaScript on purpose: it must run, and explain the problem, even on a Node.js that is too old.

import { spawn, spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import net from 'node:net'
import path from 'node:path'

const COURSE = 'React Native & Expo: Build and Ship a Mobile App'
const folder = process.cwd()
const args = process.argv.slice(2)
const metroArg = args.find((a) => a.startsWith('--metro-port='))
const api = (args.find((a) => !a.startsWith('--')) || 'http://localhost:4000').replace(/\/+$/, '').replace(/\/api$/, '')
const crew = path.join(folder, 'shoreline-crew')
const lines = []
const say = (kind, text) => lines.push(`${kind.padEnd(5)} ${text}`)

function run(cmd, cmdArgs, cwd, shell = false) {      // shell: npm, git and code are .cmd scripts on Windows
  const r = spawnSync(cmd, cmdArgs, { cwd, encoding: 'utf8', shell: shell && process.platform === 'win32', timeout: 180000 })
  return { ok: r.status === 0, out: `${r.stdout || ''}${r.stderr || ''}`, missing: Boolean(r.error) }
}

function pkgOf(name) {      // a package installed in shoreline-crew: its version and the file behind its command
  const dir = path.join(crew, 'node_modules', name)
  const json = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8'))
  const bin = typeof json.bin === 'string' ? json.bin : Object.values(json.bin || {})[0]
  return { version: json.version, file: bin ? path.join(dir, bin) : '' }
}

function reachable(url, ms = 3000) {      // a TCP connection first: a closed port answers at once (or times out)
  const { hostname, port } = new URL(url)
  return new Promise((resolve) => {
    const socket = net.connect({ host: hostname, port: Number(port) || 80 })
    const done = (why) => { socket.destroy(); resolve(why) }
    socket.setTimeout(ms, () => done('no answer (connection timed out)'))
    socket.on('connect', () => done(''))
    socket.on('error', (error) => done(error.code || error.message))
  })
}

async function getJson(url) {
  const response = await fetch(url)
  return { status: response.status, headers: response.headers, body: await response.json() }
}

function freePort() {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.listen(0, '127.0.0.1', () => { const { port } = server.address(); server.close(() => resolve(port)) })
  })
}

function stop(child) {      // the development server and everything it started, by its process id
  if (child.exitCode !== null) return Promise.resolve()
  const gone = new Promise((resolve) => child.once('exit', resolve))
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'])
  else { try { process.kill(-child.pid, 'SIGTERM') } catch { /* already gone */ } }
  const timer = setTimeout(() => { try { process.kill(-child.pid, 'SIGKILL') } catch { /* gone */ } }, 8000)
  return gone.finally(() => clearTimeout(timer))
}

// npx expo start on a spare port, then the web preview's bundle (what pressing w loads), then stopped again
async function webBundles(expoCli) {
  const port = metroArg ? Number(metroArg.split('=')[1]) : await freePort()
  const env = { ...process.env, CI: '1', BROWSER: 'none', EXPO_NO_TELEMETRY: '1' }
  const child = spawn(process.execPath, [expoCli, 'start', '--port', String(port)], {
    cwd: crew, env, stdio: ['ignore', 'pipe', 'pipe'], detached: process.platform !== 'win32',
  })
  let log = ''
  child.stdout.on('data', (d) => { log += d })
  child.stderr.on('data', (d) => { log += d })
  try {
    const base = `http://localhost:${port}`
    let page = ''
    for (let i = 0; i < 240 && !page; i++) {      // up to 60 s for Metro to start
      await new Promise((r) => setTimeout(r, 250))
      if (child.exitCode !== null) return { ok: false, why: (log.trim().split('\n').pop() || 'it stopped').trim() }
      try {
        const response = await fetch(`${base}/`, { headers: { accept: 'text/html' } })
        if (response.ok) page = await response.text()
      } catch { /* not listening yet */ }
    }
    if (!page) return { ok: false, why: `nothing answered on port ${port} within a minute` }
    const src = (page.match(/(?:src|href)="(\/[^"]+\.bundle\?[^"]*)"/) || [])[1]
    if (!src) return { ok: false, why: 'the page has no app bundle (is this an Expo Router project?)' }
    const response = await fetch(new URL(src.replace(/&amp;/g, '&'), base))
    const text = await response.text()
    if (!response.ok || !text) {
      const message = (text.match(/"message":"([^"]{0,160})/) || [])[1] || `HTTP ${response.status}`
      return { ok: false, why: `Metro could not bundle the app: ${message}` }
    }
    return { ok: text.length > 0 }
  } finally {
    await stop(child)
  }
}

console.log(`Environment check for ${COURSE}`)
console.log(`Course folder: ${path.basename(folder)}`)

// 1. Node.js, npm, Git and VS Code's command
const [major, minor] = process.versions.node.split('.').map(Number)
if (major >= 24) say('OK', `Node.js ${process.version} (24 or newer)`)
else if (major === 23 || (major === 22 && minor >= 18)) say('CHECK', `Node.js ${process.version}: the API runs on it, but the course uses the current LTS (24 or newer): install it when you can`)
else say('FIX', `Node.js ${process.version} is too old: install the current LTS (24 or newer) from nodejs.org, then open a NEW terminal`)
const npm = run('npm', ['--version'], folder, true)
if (npm.ok) say('OK', `npm ${npm.out.trim()}`)
else say('FIX', 'npm did not run: it comes with Node.js; reinstall the LTS and open a new terminal')
const git = run('git', ['--version'], folder, true)
if (git.ok) say('OK', git.out.trim().replace(/^git version /, 'Git '))
else say('CHECK', 'no `git` command: recommended (create-expo-app makes a first commit), install it from git-scm.com')
const code = run('code', ['--version'], folder, true)
if (code.ok) say('OK', `VS Code ${code.out.trim().split('\n')[0]}`)
else say('CHECK', "no `code` command: fine, open folders from VS Code's File menu (macOS: Command Palette > Shell Command: Install 'code' command in PATH)")
if (/onedrive|icloud|dropbox|google drive/i.test(folder)) say('CHECK', 'this folder is synced to the cloud: move the course folder somewhere unsynced (npm gets slow, files get locked)')

// 2. The course folder: shoreline-api and shoreline-crew
if (existsSync(path.join(folder, 'shoreline-api', 'server.ts'))) say('OK', 'shoreline-api is in the course folder')
else if (existsSync(path.join(folder, 'shoreline-api', 'shoreline-api', 'server.ts'))) say('FIX', 'shoreline-api/shoreline-api: your unzip tool added a folder level; move the inner shoreline-api up one level')
else say('FIX', 'no shoreline-api/server.ts here: run this from your course folder (cd into it), or unzip shoreline-api.zip into it')

let tools = null
let template = false
if (!existsSync(path.join(crew, 'package.json'))) {
  say('FIX', 'no shoreline-crew here: in the course folder run  npx create-expo-app@latest shoreline-crew  (Lesson 1.2, Step 3)')
} else {
  const pkg = JSON.parse(readFileSync(path.join(crew, 'package.json'), 'utf8'))
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  template = existsSync(path.join(crew, 'scripts', 'reset-project.js'))
  if (!deps.expo || !deps['expo-router']) {
    say('FIX', 'shoreline-crew is not an Expo Router project: create it again with  npx create-expo-app@latest shoreline-crew')
  } else if (!existsSync(path.join(crew, 'node_modules', 'expo', 'package.json'))) {
    say('FIX', 'shoreline-crew has no packages yet: cd shoreline-crew, then npm install')
  } else {
    tools = { expo: pkgOf('expo'), rn: pkgOf('react-native'), tsc: pkgOf('typescript') }
    const sdk = Number(tools.expo.version.split('.')[0])
    const versions = `Expo SDK ${sdk} (expo ${tools.expo.version}), React Native ${tools.rn.version}, TypeScript ${tools.tsc.version}`
    if (sdk === 58) say('OK', `shoreline-crew: ${versions}`)
    else say('CHECK', `shoreline-crew: ${versions}: the course is written for SDK 58; commands and screens may differ`)
    tools.expoCli = path.join(crew, 'node_modules', 'expo', 'bin', 'cli')
    tools.eslint = existsSync(path.join(crew, 'node_modules', 'eslint', 'package.json')) && existsSync(path.join(crew, 'eslint.config.js'))
  }
}

// 3. The API
const why = await reachable(api)
if (why) {
  say('FIX', `nothing answers at ${api} (${why}): start the API in its own terminal: cd shoreline-api, then node server.ts`)
} else {
  try {
    const health = await getJson(`${api}/api/health`)
    const meta = await getJson(`${api}/api/meta`)
    const events = await getJson(`${api}/api/events?when=upcoming`)
    if (health.status !== 200 || !String(meta.body.tagline || '').includes('cleaner sands')) {
      say('FIX', `${api} answers, but it is not the Shoreline Crew API: check the address (the API prints it when it starts)`)
    } else {
      say('OK', `the API answers at ${api}/api: "${meta.body.tagline}", ${events.headers.get('x-total-count')} upcoming cleanups`)
    }
  } catch (error) {
    say('FIX', `${api} answers, but not with the API's JSON (${error.message}): check the address and that node server.ts is running`)
  }
}

// 4. The development server, then the checkers (Lesson 1.2: Metro runs the code; tsc and the linter check it)
if (tools) {
  const web = await webBundles(tools.expoCli)
  if (web.ok) say('OK', `the development server starts (npx expo start) and bundles the app for the web preview`)
  else say('FIX', `the development server did not bundle the app: ${web.why} (cd shoreline-crew, run npx expo start, press w and read its message)`)
  if (template) {
    say('CHECK', 'shoreline-crew is still the template: Lesson 1.2 Step 6 (npm run reset-project, answer n) clears it; tsc and the linter are checked after that')
  } else {
    const tsc = run(process.execPath, [tools.tsc.file, '--noEmit'], crew)
    if (tsc.ok) say('OK', 'tsc --noEmit: no type errors')
    else {
      const first = tsc.out.split('\n').find((line) => line.includes('error TS')) || tsc.out.trim().split('\n')[0]
      say('FIX', `tsc --noEmit found type errors; the first: ${first.trim()}`)
    }
    if (!tools.eslint) {
      say('CHECK', 'the linter is not set up yet: in shoreline-crew run npx expo lint, answer y, then run it again (Lesson 1.2, Step 7)')
    } else {
      const lint = run(process.execPath, [tools.expoCli, 'lint'], crew)
      const found = (lint.out.match(/✖ \d+ problems? \(\d+ errors?, \d+ warnings?\)/) || [''])[0]
      if (lint.ok && !found) say('OK', 'npx expo lint: no problems')
      else if (lint.ok) say('CHECK', `npx expo lint: ${found}: aim for none (npx expo lint shows where)`)
      else say('FIX', `npx expo lint failed: ${found || lint.out.trim().split('\n').pop()}`)
    }
  }
}

for (const line of lines) console.log(line)
const fixes = lines.filter((line) => line.startsWith('FIX')).length
const notes = lines.filter((line) => line.startsWith('CHECK')).length
if (fixes) {
  console.log('NOT READY: fix the FIX lines above, then run this check again')
  process.exitCode = 1
} else {
  console.log(`${notes ? 'READY WITH NOTES' : 'READY'} for ${COURSE}`)
}
