// Debug handout (deliberately broken: two bugs). With the API running, from this lab's folder:
//   node debug_upcoming.ts
// Read the first message from the top, fix that line, run it again: the second bug only shows then.
const api = process.env.API_URL ?? 'http://localhost:4000';

interface Cleanup {
  title: string;
}

async function main() {
  const response = await fetch(api + 'api/events?when=upcoming');
  const events: Cleanup[] = response.json();
  console.log(`${response.status}: ${events.length} upcoming cleanups on the first page`);
  console.log(`The next one: ${events[0].title}`);
}

main();
