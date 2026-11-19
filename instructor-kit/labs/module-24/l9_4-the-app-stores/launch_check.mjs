// Launch-readiness check for React Native & Expo: Build and Ship a Mobile App (Session 24 of the instructor kit)
//
// Run it from your course folder (the one that holds shoreline-crew):
//   node labs/module-24/l9_4-the-app-stores/launch_check.mjs
// It changes nothing, needs no network and no account, and asks for no password. It reads shoreline-crew: its Git
// repository, the CI workflow from Lesson 9.3, app.config.ts, eas.json and the Your data facts from Lesson 9.4.
// Then it prints what only you can do by hand (the phone test, the push to GitHub).
// Last line: READY, READY WITH NOTES, or NOT READY (then fix the FIX lines and run it again).
// NOTE lines are information: they never stop you. An Expo account is optional, and no store account and no paid
// developer account is needed for this course or to pass it.

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const crew = path.join(process.cwd(), 'shoreline-crew')
const lines = []
const say = (kind, text) => lines.push(`${kind.padEnd(5)} ${text}`)
const read = (rel) => readFileSync(path.join(crew, rel), 'utf8')

function git(...args) {
  const r = spawnSync('git', args, { cwd: crew, encoding: 'utf8', shell: process.platform === 'win32' })
  return { ok: r.status === 0, out: (r.stdout || '').trim(), missing: Boolean(r.error) }
}

// ------------------------------------------------------------------ Node
const major = Number(process.versions.node.split('.')[0])
if (major >= 24) say('OK', `Node.js ${process.versions.node}`)
else say('FIX', `Node.js ${process.versions.node} is too old: install the current LTS (24 or newer), then open a new terminal`)

// ------------------------------------------------------------------ the project
if (!existsSync(path.join(crew, 'package.json'))) {
  say('FIX', 'no shoreline-crew here: run this check from your course folder (the one that holds shoreline-crew)')
} else {
  // ---- Git and the repository
  const top = git('rev-parse', '--show-toplevel')
  if (git('--version').missing) {
    say('FIX', 'Git is not installed: install it from git-scm.com, then open a new terminal')
  } else if (!top.ok) {
    say('FIX', 'shoreline-crew is not a Git repository: in shoreline-crew run git init, git add -A and git commit -m "First commit" (create-expo-app did this in Lesson 1.2)')
  } else if (path.resolve(top.out) !== path.resolve(crew)) {
    say('FIX', `shoreline-crew is inside another repository (${top.out}), not one of its own: add shoreline-crew/ to that repository's .gitignore and run git init in shoreline-crew (Lesson 9.3, Common Questions)`)
  } else {
    const branch = git('branch', '--show-current').out || '(none)'
    const commits = git('rev-list', '--count', 'HEAD')
    if (!commits.ok) say('FIX', 'shoreline-crew has no commit yet: git add -A, then git commit -m "First commit"')
    else say('OK', `shoreline-crew is a Git repository of its own: branch ${branch}, ${commits.out} commit${commits.out === '1' ? '' : 's'}`)

    const changes = git('status', '--porcelain').out.split('\n').filter(Boolean)
    if (changes.length) say('CHECK', `${changes.length} uncommitted change${changes.length === 1 ? '' : 's'} (git status): commit before you push; EAS also publishes only from a clean state (Lesson 9.3)`)
    else say('OK', 'nothing uncommitted')

    // ---- secrets that must never be in a repository (Lessons 9.1 and 9.4)
    const tracked = git('ls-files').out.split('\n').filter(Boolean)
    const risky = tracked.filter((f) => /(^|\/)\.env(\..+)?\.local$|\.(p8|p12|jks|keystore|key|pem|mobileprovision)$/.test(f)
      || (f.endsWith('.json') && !f.includes('node_modules') && /"private_key"\s*:/.test(readFileSync(path.join(crew, f), 'utf8'))))
    for (const f of risky) {
      say('FIX', `${f} is in the repository: a store key or local setting must never be committed. git rm --cached ${f}, add it to .gitignore, commit, and treat a key as leaked: revoke it in its console and make a new one (Lesson 9.4)`)
    }
    if (!risky.length) say('OK', 'no store keys, keystores or .env.local files in the repository')

    // ---- GitHub
    const origin = git('remote', 'get-url', 'origin')
    if (!origin.ok) say('CHECK', 'no GitHub remote yet: create an empty repository named shoreline-crew on github.com (a free account) and push (Lesson 9.3, Step 7)')
    else if (/github\.com[:/]/.test(origin.out)) say('OK', `origin is a GitHub repository: ${origin.out}`)
    else say('CHECK', `origin is ${origin.out}: the course's CI runs on GitHub Actions (Lesson 9.3, Step 7)`)

    // ---- CI (Lesson 9.3, Step 7)
    const ci = '.github/workflows/ci.yml'
    if (!existsSync(path.join(crew, ci))) {
      say('CHECK', `no ${ci} yet: the checks on every push are Lesson 9.3's Step 7`)
    } else {
      const yml = read(ci)
      const want = ['npm ci', 'npx expo customize tsconfig.json', 'npx tsc --noEmit', 'npx expo lint', 'npm test -- --watchAll=false']
      const missing = want.filter((step) => !yml.includes(`run: ${step}`))
      if (missing.length) say('FIX', `${ci} does not run: ${missing.join(', ')} (Lesson 9.3, Step 7)`)
      else say('OK', `${ci} installs with npm ci, writes the route types, then runs the type check, lint and the tests`)
      const on = yml.match(/branches:\s*\[([^\]]*)\]/)
      if (on && branch !== '(none)' && !on[1].split(',').map((s) => s.trim()).includes(branch)) {
        say('CHECK', `the workflow runs on pushes to [${on[1]}], but your branch is ${branch}: make them match (Lesson 9.3, Step 7)`)
      }
    }
  }

  // ---- config: what the lessons left for you to decide
  if (existsSync(path.join(crew, 'app.config.ts'))) {
    const config = read('app.config.ts')
    const project = (config.match(/const easProject[^=]*=\s*\{([^}]*)\}/) || [])[1] || ''
    if (/projectId:\s*'[^']+'/.test(project)) say('OK', 'app.config.ts has your Expo project id: builds and updates can use your Expo account')
    else say('NOTE', 'no Expo project id in app.config.ts: fine. An Expo account is optional in this course; without one you skip the cloud builds and updates and read their steps (Lessons 9.2 and 9.3)')
    if (config.includes('com.example.')) say('NOTE', 'the app ids are still com.example.*: right for the course; your own app picks ids on a domain you control before its first upload (Lesson 9.4)')
  }
  if (existsSync(path.join(crew, 'eas.json'))) {
    let eas = {}
    try { eas = JSON.parse(read('eas.json')) } catch { say('FIX', 'eas.json is not valid JSON') }
    const build = eas.build || {}
    if (build.preview?.channel === 'preview' && build.production?.channel === 'production') say('OK', 'eas.json: preview and production builds have their own update channels')
    else say('CHECK', 'eas.json: preview and production need their own channels (Lesson 9.3, Step 3)')
    if (eas.submit?.production?.android?.track === 'internal') say('OK', 'eas.json: store uploads go to internal testing first')
    else say('CHECK', 'eas.json: the production submit profile has no "track": "internal" yet (Lesson 9.4, Step 6)')
  }
  if (existsSync(path.join(crew, 'src/utils/privacy.ts'))) {
    const privacy = read('src/utils/privacy.ts')
    say('OK', 'src/utils/privacy.ts: the Your data facts, the same ones the privacy forms are answered from')
    if (privacy.includes('.example.org')) say('NOTE', 'the privacy policy and deletion links are example.org placeholders: right for the course, a rejection in a store (Lesson 9.4)')
  } else {
    say('CHECK', 'no src/utils/privacy.ts yet: the Your data screen is Lesson 9.4, Step 2')
  }
  const env = existsSync(path.join(crew, '.env.local')) ? read('.env.local') : ''
  const apiUrl = (env.match(/^EXPO_PUBLIC_API_URL=(.*)$/m) || [])[1]
  if (!apiUrl) say('CHECK', 'no EXPO_PUBLIC_API_URL in shoreline-crew/.env.local: copy .env.example to .env.local (the download\'s README, Lesson 5.1)')
  else if (/localhost|127\.0\.0\.1/.test(apiUrl)) say('NOTE', `the app reads the API at ${apiUrl}: right for the web preview; a phone needs your computer's address instead (below)`)
  else say('OK', `the app reads the API at ${apiUrl}`)
}

// ------------------------------------------------------------------ what only you can do (no tool can check these)
const byHand = [
  "The phone test (Lessons 1.2 and 5.1): phone and computer on the same Wi-Fi; start the API with node server.ts --host and Metro with npx expo start; scan the QR code with Expo Go (iPhone: allow Local Network), or open http://<your computer's address>:4000/api in the phone's browser. The address is the one in Metro's exp:// line.",
  'If the phone cannot connect: a guest or venue network often blocks phones from reaching computers. Try a hotspot from the phone, then npx expo start --tunnel, then the web preview (press w): a valid way to finish every lesson and the final project.',
  'GitHub: push (git push), open the repository\'s Actions tab, and wait for the green check of the CI run (Lesson 9.3, Step 7).',
  'Expo account: OPTIONAL. With one, Lessons 9.2 and 9.3 make real builds and updates on the Free plan; without one, nothing in the course is blocked.',
  'Store accounts: NOT REQUIRED. No Apple Developer Program or Google Play Console account and no paid developer account is needed for this course, for the final project, or to pass. Do not pay for one for the course.',
]

const fix = lines.some((l) => l.startsWith('FIX'))
const check = lines.some((l) => l.startsWith('CHECK'))
console.log('Launch-readiness check: Shoreline Crew, before the final project')
console.log('')
console.log(lines.join('\n'))
console.log('')
console.log('DO BY HAND (no tool can check these):')
for (const item of byHand) console.log(`  - ${item}`)
console.log('')
if (fix) {
  console.log('NOT READY: fix the FIX lines above, then run this check again')
  process.exitCode = 1
} else if (check) {
  console.log('READY WITH NOTES: the CHECK lines are steps of Lessons 9.3 and 9.4 still to do; nothing stops the final project')
} else {
  console.log('READY for Session 25: the final project')
}
