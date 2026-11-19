// Check eas.json on your computer before a cloud build (Task 2): node check-eas.ts
import { readFileSync } from 'node:fs';

import { checkProfiles } from './checkProfiles.ts';
import { parseEasJson } from './eas.ts';

const eas = parseEasJson(readFileSync(new URL('./eas.json', import.meta.url), 'utf8'));
const names = Object.keys(eas.build);
console.log(`eas.json: ${names.length} build profiles (${names.join(', ')})`);

const { problems, notes } = checkProfiles(eas);
for (const problem of problems) console.log(`PROBLEM ${problem}`);
for (const note of notes) console.log(`note    ${note}`);
if (problems.length > 0) {
  console.log(`${problems.length} problem${problems.length === 1 ? '' : 's'}: fix eas.json before you spend a build`);
  process.exitCode = 1;
} else {
  console.log('No problems: every profile builds the app it should');
}
