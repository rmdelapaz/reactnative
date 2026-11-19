// The debug handout, fixed (instructor copy). With the API running, from solution/:
//   node src/countUpcoming.ts
const api = process.env.API_URL ?? 'http://localhost:4000';

interface Cleanup {
  title: string;
}

async function main() {
  const response = await fetch(`${api}/api/events?when=upcoming`);
  const events: Cleanup[] = await response.json();
  console.log(`${response.status}: ${events.length} upcoming cleanups on the first page`);
  console.log(`The next one: ${events[0].title}`);
}

main();
