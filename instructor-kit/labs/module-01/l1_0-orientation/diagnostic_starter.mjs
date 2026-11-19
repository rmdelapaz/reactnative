// Diagnostic practice (Session 1): JavaScript answers D1, D2 and D3 of your workbook's diagnostic.
// Each answer below has ONE small mistake. Run it, compare with the workbook, fix the line, run again.
//   node labs/module-01/l1_0-orientation/diagnostic_starter.mjs        (from your course folder)

const events = [
  { title: 'Weekend Cove Cleanup', capacity: 18, spotsTaken: 18 },
  { title: 'Jetty Rocks Deep Clean', capacity: 10, spotsTaken: 9 },
  { title: 'Family Beach Morning', capacity: 40, spotsTaken: 16 },
]

// D1: filter and map. Print the titles of the cleanups that still have spots left.
console.log('D1:', events.filter((event) => event.spotsTaken >= event.capacity).map((event) => event.title))

// D2: a copy with one change (how React state is updated). Sign one more volunteer up for the second cleanup,
// without changing the original object, then print the original's count and the copy's count.
const jetty = events[1]
const signedUp = jetty
signedUp.spotsTaken = jetty.spotsTaken + 1
console.log('D2:', jetty.spotsTaken, signedUp.spotsTaken)

// D3: ?? keeps 0. Print how many spots the full cleanup has left, or 'unknown' only when the number is missing.
const left = events[0].capacity - events[0].spotsTaken
console.log('D3:', left || 'unknown')

// Expected when done:
// D1: [ 'Jetty Rocks Deep Clean', 'Family Beach Morning' ]
// D2: 9 10
// D3: 0
