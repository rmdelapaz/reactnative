// Final project evidence check (instructor kit, Session 26). Run it on a final project two days before the
// showcase: it reads the project's files (no network, no install, nothing changed) and lists the evidence the
// Lesson 10.1 rubric asks for that is still missing. It does NOT score the project: the rubric does, with a person.
//
//   node labs/module-26/showcase-preflight/evidence_check.mjs [project folder]   (default: the current folder)
//
// Every line starts with PASS, FIX (missing evidence: the verdict is NOT READY, exit code 1) or CHECK (look at it
// yourself: READY WITH NOTES). The rubric row each line belongs to is in brackets.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? '.';
const results = [];
const line = (kind, row, text) => results.push({ kind, row, text });
const pass = (row, text) => line('PASS', row, text);
const fix = (row, text) => line('FIX', row, text);
const check = (row, text) => line('CHECK', row, text);

function read(rel) {
  const file = join(root, rel);
  return existsSync(file) ? readFileSync(file, 'utf8') : null;
}

/** Every file under a folder (no node_modules, dist or hidden folders), as paths relative to the project */
function filesUnder(rel) {
  const start = join(root, rel);
  if (!existsSync(start)) return [];
  const found = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir).sort()) {
      if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue;
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else found.push(relative(root, full).split('\\').join('/'));
    }
  };
  walk(start);
  return found;
}

/** The table rows of one "## N. Title" section of worksheet.md, as arrays of trimmed cells (header row first) */
function sectionRows(worksheet, number) {
  const parts = worksheet.split(/^## /m);
  const section = parts.find((part) => part.startsWith(`${number}. `)) ?? '';
  return section
    .split('\n')
    .filter((text) => text.trim().startsWith('|') && !/^\|\s*-/.test(text.trim()))
    .map((text) => text.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim()));
}

// The starter's own test files: a project that has only these has not tested its own rules yet
const STARTER_TESTS = [
  'app.config.test.ts',
  'src/api/client.test.ts',
  'src/api/source.test.ts',
  'src/mock-api/items.test.ts',
  'src/monitoring/reportError.test.ts',
  'src/test/screens/items.test.tsx',
];

const pkgText = read('package.json');
if (pkgText === null) {
  fix('-', `no package.json in ${root}: run the check in your project's folder, or give it the folder`);
} else {
  // ---- Make it yours (Lesson 10.1, Step 4)
  const pkg = JSON.parse(pkgText);
  if (pkg.name === 'starter') fix('9', 'package.json still says "name": "starter": give the project its own name');
  else pass('9', `the project has its own name (${pkg.name})`);
  const config = read('app.config.ts') ?? '';
  const names = [...config.matchAll(/name:\s*'([^']*)'/g)].map((match) => match[1]);
  const ids = [...config.matchAll(/appId:\s*'([^']*)'/g)].map((match) => match[1]);
  if (names.length === 0 || names.some((name) => name.startsWith('Starter'))) {
    fix('9', 'app.config.ts: the variants are still called Starter Dev, Starter Preview and Starter');
  } else pass('9', `the three variants have your names (${names.join(', ')})`);
  if (ids.length === 0 || ids.some((id) => id.startsWith('com.example.starter'))) {
    fix('9', 'app.config.ts: the app ids are still com.example.starter: use a domain your client owns');
  } else if (ids.some((id) => id.startsWith('com.example.'))) {
    check('9', `app.config.ts: the ids still start with com.example (${ids[0]}): fine for now, "to do" on the release checklist`);
  } else pass('9', `the app ids are your own (${ids.join(', ')})`);
  if (/slug:\s*'starter'|scheme:\s*'starter'/.test(config)) fix('9', "app.config.ts: slug or scheme is still 'starter'");
  else pass('9', 'slug and scheme are your own');
  const configTest = read('app.config.test.ts') ?? '';
  if (/Starter Dev|com\.example\.starter/.test(configTest)) {
    fix('9', 'app.config.test.ts still expects the starter\'s names and ids: it fails once they are yours');
  } else pass('9', 'app.config.test.ts expects your names and ids');

  // ---- Row 1: the plan
  const worksheet = read('worksheet.md');
  if (worksheet === null) {
    fix('1', "no worksheet.md next to package.json: copy the kit's worksheet into the project and keep it in Git");
  } else {
    const blanks = ['Project name', 'Brief', 'Your name', 'Peer reviewer'].filter(
      (label) => !new RegExp(`^${label}[^:\\n]*:[ \\t]*\\S`, 'm').test(worksheet),
    );
    if (blanks.length > 0) fix('1', `worksheet.md: the top lines are not filled in (${blanks.join(', ')})`);
    else pass('1', 'worksheet.md names the project, the brief, you and your peer reviewer');
    const charter = sectionRows(worksheet, 0).slice(1);
    const empty = charter.filter((cells) => (cells[1] ?? '') === '').length;
    if (charter.length === 0 || empty > 0) fix('1', `worksheet.md section 0 (charter): ${empty} of ${charter.length} questions not answered`);
    else pass('1', `worksheet.md: the charter answers all ${charter.length} questions`);
    const release = sectionRows(worksheet, 14).filter((cells) => cells.length === 3).slice(1);
    const unmarked = release.filter((cells) => cells[2] === '').map((cells) => cells[0]);
    if (release.length === 0) fix('9', 'worksheet.md section 14: no release checklist table');
    else if (unmarked.length > 0) fix('9', `worksheet.md section 14: release checklist lines without a status: ${unmarked.join(', ')} (done, not possible yet, or to do)`);
    else pass('9', `worksheet.md: all ${release.length} release checklist lines have a status`);
    const plan = sectionRows(worksheet, 16);
    const head = plan[0] ?? [];
    const col = head.indexOf('Actual');
    const milestones = plan.slice(1).filter((cells) => /^\d+$/.test(cells[0] ?? ''));
    const missing = milestones.filter((cells) => col < 0 || (cells[col] ?? '') === '').map((cells) => cells[0]);
    if (col < 0 || milestones.length === 0) fix('1', 'worksheet.md section 16: no milestone table with an "Actual" column');
    else if (missing.includes('1')) fix('1', 'worksheet.md section 16: no actual hours for Milestone 1');
    else if (missing.length > 0) check('1', `worksheet.md section 16: no actual hours yet for Milestone ${missing.join(', ')}`);
    else pass('1', `worksheet.md: actual hours for all ${milestones.length} milestones`);
    const log = plan.filter((cells) => /^\d+(\.\d+)?$/.test(cells[1] ?? '') && !/^\d+$/.test(cells[0] ?? ''));
    if (log.length === 0) fix('1', 'worksheet.md section 16: the time log has no line with hours yet');
    else pass('1', `worksheet.md: ${log.length} lines in the time log`);
  }

  // ---- Row 3: types and data
  const types = read('src/api/types.ts');
  if (types === null) fix('3', 'no src/api/types.ts: the domain types live there');
  else if (/export interface Item\b/.test(types)) fix('3', 'src/api/types.ts still has the example Item (Milestone 2 deletes it)');
  else pass('3', 'src/api/types.ts has no example Item left');
  const code = filesUnder('src').filter((rel) => /\.(ts|tsx)$/.test(rel));
  const anyLines = [];
  for (const rel of code) {
    readFileSync(join(root, rel), 'utf8').split('\n').forEach((text, i) => {
      // the code part of the line only: comments may say "any" in plain English
      const codePart = /^\s*(\*|\/\*)/.test(text) ? '' : text.replace(/\/\/.*$/, '');
      if (/(:\s*any\b|\bas any\b|<any>)/.test(codePart)) anyLines.push(`${rel}:${i + 1}`);
    });
  }
  if (anyLines.length > 0) check('3', `"any" in ${anyLines.length} place(s), first ${anyLines[0]}: be ready to say why`);
  else pass('3', `no "any" in ${code.length} files under src`);

  // ---- Row 8: tests and CI
  if (existsSync(join(root, '.github/workflows/ci.yml'))) pass('8', '.github/workflows/ci.yml is at the top of the project');
  else fix('8', 'no .github/workflows/ci.yml at the top of the project: CI runs from there');
  const tests = [...code, ...(existsSync(join(root, 'app.config.test.ts')) ? ['app.config.test.ts'] : [])]
    .filter((rel) => /\.test\.tsx?$/.test(rel));
  const own = tests.filter((rel) => !STARTER_TESTS.includes(rel));
  if (tests.length === 0) fix('8', 'no *.test.ts(x) files: the starter came with six');
  else if (own.length === 0) fix('8', "only the starter's own test files: your mock API's rules need theirs (Milestone 1)");
  else pass('8', `${tests.length} test files, ${own.length} of them your own (first ${own[0]})`);

  // ---- Row 9: secrets
  const ignore = read('.gitignore') ?? '';
  if (!/^\.env\*?\.local$/m.test(ignore)) fix('9', '.gitignore does not cover .env.local (.env*.local)');
  else pass('9', '.gitignore keeps .env.local out of Git');
  const secretName = /\bEXPO_PUBLIC_[A-Z0-9_]*(SECRET|TOKEN|PASSWORD|PRIVATE|KEY)\b/;
  const secretHits = ['.env.example', 'app.config.ts', 'eas.json', ...code]
    .filter((rel) => existsSync(join(root, rel)))
    .flatMap((rel) => readFileSync(join(root, rel), 'utf8').split('\n')
      .map((text, i) => (secretName.test(text) ? `${rel}:${i + 1} (${secretName.exec(text)[0]})` : null))
      .filter(Boolean));
  if (secretHits.length > 0) fix('9', `an EXPO_PUBLIC_ variable named like a secret, ${secretHits[0]}: every EXPO_PUBLIC_ value ships inside the app`);
  else pass('9', 'no EXPO_PUBLIC_ variable named like a secret');

  // ---- Row 10: the README, the launch and the peer review
  const readme = read('README.md');
  if (readme === null || readme.startsWith('# Final project starter')) {
    fix('10', "README.md is still the starter's: what the app is, how to run it, your launch");
  } else {
    pass('10', 'README.md is your own');
    if (/npm ci/.test(readme)) pass('10', 'README.md says how to run it (npm ci)');
    else check('10', 'README.md does not say how to run it (npm ci, .env.local, npx expo start)');
    const link = /https:\/\/[^\s)>\]]+/.exec(readme)?.[0];
    if (link) pass('10', `README.md links to the launch (${link})`);
    else check('10', 'README.md has no https:// link to your recording or preview build');
    if (/^#+\s*Maintenance/m.test(readme)) pass('10', 'README.md has a Maintenance section (Lesson 10.2)');
    else check('10', 'README.md has no Maintenance section (Lesson 10.2, Step 6)');
  }
  const review = readdirSync(root).find((name) => /^peer-review-(received|from)/i.test(name));
  if (review) pass('10', `the review you received is in ${review}`);
  else check('10', 'no peer-review-received.md: bring the review you received and your answers to it');

  // ---- Lesson 10.2: the team kit
  const decisions = filesUnder('docs/decisions').filter((rel) => rel.endsWith('.md'));
  if (decisions.length > 0) pass('1', `${decisions.length} decision record(s), first ${decisions[0]}`);
  else check('1', 'no docs/decisions/*.md: the Expo Go or development build decision (Lesson 10.2, Step 4)');
  if (existsSync(join(root, '.github/pull_request_template.md'))) pass('8', '.github/pull_request_template.md asks the phone questions');
  else check('8', 'no .github/pull_request_template.md (Lesson 10.2, Step 5)');
}

for (const r of results) console.log(`${r.kind.padEnd(5)} [row ${r.row}] ${r.text}`);
const count = (kind) => results.filter((r) => r.kind === kind).length;
console.log('');
console.log(`${count('PASS')} passed, ${count('FIX')} to fix, ${count('CHECK')} to check`);
if (count('FIX') > 0) {
  console.log('NOT READY: fix the FIX lines above, then run this check again');
  process.exitCode = 1;
} else if (count('CHECK') > 0) {
  console.log('READY WITH NOTES: look at the CHECK lines before the showcase');
} else {
  console.log('READY FOR THE SHOWCASE');
}
