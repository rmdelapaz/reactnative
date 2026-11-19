// Diagnostic practice (Session 1): the reference answers to D1, D2 and D3 (instructor copy).

const events = [
  { title: 'Weekend Cove Cleanup', capacity: 18, spotsTaken: 18 },
  { title: 'Jetty Rocks Deep Clean', capacity: 10, spotsTaken: 9 },
  { title: 'Family Beach Morning', capacity: 40, spotsTaken: 16 },
]

// D1: keep the cleanups with spots left, then keep only their titles
console.log('D1:', events.filter((event) => event.spotsTaken < event.capacity).map((event) => event.title))

// D2: spread makes a NEW object; the original stays as it was (React compares objects, never edit them)
const jetty = events[1]
const signedUp = { ...jetty, spotsTaken: jetty.spotsTaken + 1 }
console.log('D2:', jetty.spotsTaken, signedUp.spotsTaken)

// D3: ?? falls back only for null and undefined; || also replaces 0, which is a real answer here
const left = events[0].capacity - events[0].spotsTaken
console.log('D3:', left ?? 'unknown')
