// Loads the web export (dist/) the way a browser starts it, but in Node and without a page: every
// module of the bundle runs, so a library that cannot work on the web stops it here with its own
// error. First: npx expo export --platform web --output-dir dist --clear
import { readdirSync, readFileSync } from 'node:fs';
import vm from 'node:vm';

const folder = 'dist/_expo/static/js/web/';
const bundle = readdirSync(folder).find((name) => name.endsWith('.js'));
try {
  vm.runInNewContext(readFileSync(folder + bundle, 'utf8'), { console, setTimeout, clearTimeout, queueMicrotask });
  console.log('The web bundle loads without an error.');
} catch (error) {
  console.log(`The web bundle stops while loading: ${error.message}`);
  process.exitCode = 1;
}
