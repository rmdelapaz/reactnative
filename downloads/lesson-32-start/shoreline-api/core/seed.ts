// The sample data: the same people, places and cleanups every time, with dates placed around "today".
// Pure functions only (no Node APIs), so the same seed runs in the server, in MSW handlers and in tests.
import type {
  CleanupEvent, CleanupLog, DateString, DebrisCategory, DebrisCount, ImpactReport, Signup, SignupStatus, Site,
  Skill, Volunteer,
} from './types.ts'

export const ORGANIZATION = 'Shoreline Crew'
export const TAGLINE = 'Many hands, cleaner sands.'
export const TIME_ZONE = 'America/Los_Angeles'
/** Every sample account signs in with this password. */
export const DEMO_PASSWORD = 'shoreline-demo'

export const SKILLS: Array<{ id: Skill; label: string }> = [
  { id: 'first-aid', label: 'First aid' },
  { id: 'boat-handling', label: 'Boat handling' },
  { id: 'heavy-lifting', label: 'Heavy lifting' },
  { id: 'photography', label: 'Photography' },
  { id: 'data-recording', label: 'Data recording' },
  { id: 'team-lead', label: 'Team lead' },
]

export const DEBRIS_CATEGORIES: Array<{ id: DebrisCategory; label: string }> = [
  { id: 'plastic-bottles', label: 'Plastic bottles' },
  { id: 'plastic-bags', label: 'Plastic bags' },
  { id: 'food-wrappers', label: 'Food wrappers' },
  { id: 'bottle-caps', label: 'Bottle caps' },
  { id: 'cigarette-butts', label: 'Cigarette butts' },
  { id: 'fishing-gear', label: 'Fishing line and nets' },
  { id: 'glass', label: 'Glass' },
  { id: 'metal', label: 'Metal and cans' },
  { id: 'foam', label: 'Foam pieces' },
  { id: 'other', label: 'Other' },
]

// ---------------------------------------------------------------------------------------------- dates

/** today + n days, both "YYYY-MM-DD" (calendar arithmetic, no time zones involved) */
export function addDays(date: DateString, n: number): DateString {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** The local calendar date of a Date in a time zone, as "YYYY-MM-DD". */
export function localDate(now: Date, timeZone: string = TIME_ZONE): DateString {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

/** A UTC timestamp on a local date (approximate: noon UTC + hours), stable for sorting and display. */
function stamp(date: DateString, hour = 12): string {
  return `${date}T${String(hour).padStart(2, '0')}:00:00.000Z`
}

/** Small deterministic random numbers (mulberry32), so every seed is identical. */
function random(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---------------------------------------------------------------------------------------------- places

export const SITES: Site[] = [
  {
    id: 'pelican-point', name: 'Pelican Point Beach', town: 'Port Marisol', terrain: 'sand', accessible: true,
    latitude: 36.9512, longitude: -122.0461, parking: 'Free lot at the end of Pelican Point Road (40 spaces).',
    description: 'A long sandy beach below the bluffs. Busy in summer, so food wrappers and bottle caps pile up near the stairs.',
    image: { url: '/images/sites/pelican-point.jpg', alt: 'A wide sandy beach below tall bluffs, with a wooden staircase down the cliff and calm blue water.', width: 1200, height: 675 },
  },
  {
    id: 'driftwood-cove', name: 'Driftwood Cove', town: 'Port Marisol', terrain: 'mixed', accessible: false,
    latitude: 36.9387, longitude: -122.0219, parking: 'Street parking on Cove Lane; arrive early.',
    description: 'A small cove where winter storms leave driftwood, rope and fishing gear tangled at the tide line.',
    image: { url: '/images/sites/driftwood-cove.jpg', alt: 'A small curved cove with pale sand, gray driftwood logs along the tide line and dark rocks at each end.', width: 1200, height: 675 },
  },
  {
    id: 'sandpiper-flats', name: 'Sandpiper Flats', town: 'Calder Bay', terrain: 'marsh', accessible: true,
    latitude: 36.9015, longitude: -121.9644, parking: 'Visitor center lot (free) with a boardwalk to the meeting point.',
    description: 'Tidal marsh and mudflats. Stay on the boardwalk and marked paths: the birds nest here in spring.',
    image: { url: '/images/sites/sandpiper-flats.jpg', alt: 'Green tidal marsh with channels of water winding through it and a wooden boardwalk crossing the flats.', width: 1200, height: 675 },
  },
  {
    id: 'north-jetty', name: 'North Jetty', town: 'Calder Bay', terrain: 'rocky', accessible: false,
    latitude: 36.9122, longitude: -121.9811, parking: 'Harbor lot B (pay at the machine, free before 9:00).',
    description: 'Rocks along the harbor mouth. Lots of fishing line and lures; gloves and sturdy shoes required.',
    image: { url: '/images/sites/north-jetty.jpg', alt: 'A long jetty of gray boulders reaching into the sea at the mouth of a harbor, with waves breaking on the rocks.', width: 1200, height: 675 },
  },
  {
    id: 'otter-creek', name: 'Otter Creek Mouth', town: 'Seal Rock', terrain: 'mixed', accessible: false,
    latitude: 36.9790, longitude: -122.1183, parking: 'Gravel pull-out on Highway 1 (12 spaces).',
    description: 'Where the creek meets the ocean. Trash washes down after rain and collects in the willows.',
    image: { url: '/images/sites/otter-creek.jpg', alt: 'A creek flowing out of green willows across the beach into the ocean, with low hills behind.', width: 1200, height: 675 },
  },
  {
    id: 'long-strand', name: 'Long Strand Beach', town: 'Seal Rock', terrain: 'sand', accessible: true,
    latitude: 36.9944, longitude: -122.1530, parking: 'State beach lot (day-use fee; the crew covers it for volunteers).',
    description: 'Three miles of open beach with a paved path along the dunes. Our biggest cleanups happen here.',
    image: { url: '/images/sites/long-strand.jpg', alt: 'A very long open beach with grassy dunes and a paved path running beside them toward the horizon.', width: 1200, height: 675 },
  },
]

// ---------------------------------------------------------------------------------------------- people

const PEOPLE: Array<[id: string, name: string, role: 'organizer' | 'volunteer', skills: Skill[], joinedDaysAgo: number]> = [
  ['v01', 'Maya Okafor', 'organizer', ['team-lead', 'first-aid'], 1460],
  ['v02', 'Luis Romero', 'organizer', ['team-lead', 'boat-handling'], 1100],
  ['v03', 'Hannah Becker', 'organizer', ['data-recording', 'team-lead'], 820],
  ['v04', 'Theo Nakamura', 'volunteer', ['photography'], 700],
  ['v05', 'Amara Diallo', 'volunteer', ['first-aid', 'heavy-lifting'], 650],
  ['v06', 'Grace Whitaker', 'volunteer', ['data-recording'], 610],
  ['v07', 'Mateo Silva', 'volunteer', ['heavy-lifting'], 540],
  ['v08', 'Ines Moreau', 'volunteer', ['photography', 'data-recording'], 500],
  ['v09', 'Kwame Asante', 'volunteer', ['boat-handling', 'heavy-lifting'], 455],
  ['v10', 'Sofia Lindgren', 'volunteer', [], 420],
  ['v11', 'Ravi Patel', 'volunteer', ['first-aid'], 380],
  ['v12', 'Elena Vasquez', 'volunteer', ['team-lead'], 350],
  ['v13', 'Oliver Grant', 'volunteer', [], 300],
  ['v14', 'Noor Haddad', 'volunteer', ['data-recording'], 260],
  ['v15', 'Jonah Fairweather', 'volunteer', ['heavy-lifting'], 230],
  ['v16', 'Lily Tran', 'volunteer', ['photography'], 200],
  ['v17', 'Samuel Osei', 'volunteer', ['first-aid', 'team-lead'], 170],
  ['v18', 'Chloe Dubois', 'volunteer', [], 140],
  ['v19', 'Diego Herrera', 'volunteer', ['boat-handling'], 110],
  ['v20', 'Aisha Rahman', 'volunteer', ['data-recording'], 80],
  ['v21', 'Ben Kowalski', 'volunteer', [], 55],
  ['v22', 'Mia Johansson', 'volunteer', ['photography'], 35],
  ['v23', 'Tariq Mensah', 'volunteer', ['heavy-lifting'], 20],
  ['v24', 'Zoe Castillo', 'volunteer', [], 6],
]

function email(name: string): string {
  return name.toLowerCase().replace(/[^a-z ]/g, '').replace(' ', '.') + '@example.com'
}

// ---------------------------------------------------------------------------------------------- cleanups

// [id, title, site, days from today, start, end, capacity, status, lead]
const EVENTS: Array<[string, string, string, number, string, string, number, CleanupEvent['status'], string]> = [
  ['e01', 'Storm Debris Sweep', 'driftwood-cove', -150, '09:00', '12:00', 20, 'completed', 'v02'],
  ['e02', 'Jetty Fishing Line Roundup', 'north-jetty', -122, '08:30', '11:00', 12, 'completed', 'v02'],
  ['e03', 'Marsh Boardwalk Cleanup', 'sandpiper-flats', -95, '10:00', '12:30', 15, 'completed', 'v03'],
  ['e04', 'Pelican Point Beach Sweep', 'pelican-point', -66, '09:00', '12:00', 30, 'completed', 'v01'],
  ['e05', 'Creek Mouth After the Rains', 'otter-creek', -45, '09:30', '12:00', 15, 'cancelled', 'v03'],
  ['e06', 'Long Strand Big Day', 'long-strand', -31, '08:00', '13:00', 60, 'completed', 'v01'],
  ['e07', 'Sunset Stairs Cleanup', 'pelican-point', -12, '16:30', '18:30', 20, 'completed', 'v02'],
  ['e17', 'Tide Pool Morning Cleanup', 'otter-creek', 0, '08:00', '10:30', 12, 'scheduled', 'v03'],
  ['e08', 'Weekend Cove Cleanup', 'driftwood-cove', 3, '09:00', '11:30', 18, 'scheduled', 'v02'],
  ['e09', 'Boardwalk and Mudflats', 'sandpiper-flats', 9, '10:00', '12:30', 16, 'scheduled', 'v03'],
  ['e10', 'Family Beach Morning', 'pelican-point', 16, '09:00', '11:00', 40, 'scheduled', 'v01'],
  ['e11', 'Jetty Rocks Deep Clean', 'north-jetty', 23, '08:30', '11:30', 10, 'scheduled', 'v02'],
  ['e12', 'Creek Mouth Willows', 'otter-creek', 30, '09:30', '12:00', 14, 'scheduled', 'v03'],
  ['e13', 'Long Strand Coastal Cleanup Day', 'long-strand', 44, '08:00', '13:00', 80, 'scheduled', 'v01'],
  ['e14', 'Night Heron Walk and Clean', 'sandpiper-flats', 58, '17:00', '19:00', 12, 'scheduled', 'v03'],
  ['e15', 'Harbor Kayak Cleanup', 'north-jetty', 72, '09:00', '12:00', 8, 'draft', 'v02'],
  ['e16', 'Beach Reset Day', 'long-strand', 95, '10:00', '13:00', 50, 'draft', 'v01'],
]

const DESCRIPTIONS: Record<string, string> = {
  'driftwood-cove': 'We work the tide line from the stairs to the north rocks. Bring a water bottle; we bring the rest.',
  'north-jetty': 'Careful work on the rocks: we cut and bag fishing line and collect lures and weights.',
  'sandpiper-flats': 'A quiet cleanup along the boardwalk and marsh edge. Good for first-timers and families.',
  'pelican-point': 'A classic beach sweep in teams of four. Kids are welcome with an adult.',
  'otter-creek': 'We clear trash caught in the willows and along the creek banks. Expect mud.',
  'long-strand': 'Our largest cleanup: teams spread out along three miles of beach and dunes.',
}

const MEETING_POINTS: Record<string, string> = {
  'driftwood-cove': 'Top of the Cove Lane stairs',
  'north-jetty': 'Harbor lot B, by the bait shop',
  'sandpiper-flats': 'Visitor center front porch',
  'pelican-point': 'Lifeguard tower 3',
  'otter-creek': 'Gravel pull-out on Highway 1',
  'long-strand': 'Main lot information board',
}

export interface SeedData {
  today: DateString
  sites: Site[]
  volunteers: Volunteer[]
  events: Array<CleanupEvent & { checkInCode: string }>
  signups: Signup[]
  reports: ImpactReport[]
  logs: CleanupLog[]
}

/** Build the sample data for a given "today". Identical output for the same date. */
export function createSeed(today: DateString): SeedData {
  const rand = random(20260614)
  const volunteers: Volunteer[] = PEOPLE.map(([id, name, role, skills, joined]) => ({
    id, name, email: email(name), phone: Number(id.slice(1)) % 3 === 0 ? null : `(831) 555-01${id.slice(1)}`,
    role, skills, joinedOn: addDays(today, -joined), hoursLogged: 0,
  }))

  const events = EVENTS.map(([id, title, siteId, days, startTime, endTime, capacity, status, lead], i) => {
    const date = addDays(today, days)
    const created = addDays(today, Math.min(days, 0) - 21)
    return {
      id, title, siteId, status, date, startTime, endTime, capacity, spotsTaken: 0,
      meetingPoint: MEETING_POINTS[siteId] ?? 'See the event description',
      description: DESCRIPTIONS[siteId] ?? '',
      suppliesProvided: ['Gloves', 'Bags', ...(siteId === 'north-jetty' ? ['Line cutters'] : []), ...(capacity >= 40 ? ['Water and snacks'] : [])],
      leadOrganizerId: lead,
      checkInCode: String(1000 + ((i * 7919 + 4111) % 9000)),
      createdAt: stamp(created, 17),
      updatedAt: stamp(days < 0 ? addDays(date, 1) : addDays(created, 2), 18),
    }
  })

  // sign-ups: each event gets a share of the crew; past events have attendance
  const signups: Signup[] = []
  let n = 0
  for (const ev of events) {
    if (ev.status === 'draft') continue
    const past = ev.date < today
    const fill = ev.status === 'cancelled' ? 0.4 : Math.min(1, 0.35 + rand() * 0.6)
    const wanted = Math.max(3, Math.round(Math.min(ev.capacity, volunteers.length) * fill))
    const pool = [...volunteers].sort(() => rand() - 0.5).slice(0, Math.min(wanted, volunteers.length))
    // the small cove cleanup (e08) is full, with a waiting list, so apps can show both
    const full = ev.id === 'e08'
    pool.forEach((v, k) => {
      n += 1
      let status: SignupStatus = 'confirmed'
      if (ev.status === 'cancelled') status = 'cancelled'
      else if (past) status = rand() < 0.88 ? 'attended' : 'no-show'
      else if (full && k >= ev.capacity) status = 'waitlisted'
      else if (rand() < 0.06) status = 'cancelled'
      signups.push({
        id: `s${String(n).padStart(3, '0')}`, eventId: ev.id, volunteerId: v.id, status,
        note: k % 5 === 0 ? 'Bringing my own gloves.' : '',
        createdAt: stamp(addDays(ev.date, -Math.round(3 + rand() * 20)), 15),
        checkedInAt: status === 'attended' ? `${ev.date}T${ev.startTime}:00.000Z` : null,
      })
    })
    if (full) {
      // fill e08 exactly: everyone confirmed up to capacity, two more waiting
      const taken = signups.filter((s) => s.eventId === ev.id && s.status === 'confirmed').length
      const extra = volunteers.filter((v) => !pool.includes(v)).slice(0, Math.max(0, ev.capacity - taken) + 2)
      extra.forEach((v, k) => {
        n += 1
        signups.push({
          id: `s${String(n).padStart(3, '0')}`, eventId: ev.id, volunteerId: v.id,
          status: k < ev.capacity - taken ? 'confirmed' : 'waitlisted', note: '',
          createdAt: stamp(addDays(ev.date, -2), 15), checkedInAt: null,
        })
      })
    }
  }

  // impact reports for completed cleanups
  const reports: ImpactReport[] = events.filter((e) => e.status === 'completed').map((ev) => {
    const attended = signups.filter((s) => s.eventId === ev.id && s.status === 'attended').length
    const items: DebrisCount[] = DEBRIS_CATEGORIES.map(({ id }) => ({
      category: id,
      count: Math.round(attended * (id === 'cigarette-butts' ? 40 : id === 'fishing-gear' && ev.siteId === 'north-jetty' ? 25 : 6) * (0.4 + rand())),
    }))
    const weightKg = Math.round(attended * (1.5 + rand() * 2.5) * 10) / 10
    return {
      eventId: ev.id, volunteersAttended: attended, bags: Math.max(1, Math.round(weightKg / 4)), weightKg, items,
      notes: ev.siteId === 'north-jetty' ? 'Two tangled nets reported to the harbor office.' : '',
      photoIds: [],
      submittedAt: stamp(addDays(ev.date, 1), 20),
    }
  })

  // a few phone logs from the most recent cleanup (what the React Native app sends)
  const recent = events.find((e) => e.id === 'e07')
  const logs: CleanupLog[] = recent
    ? signups.filter((s) => s.eventId === recent.id && s.status === 'attended').slice(0, 3).map((s, k) => ({
      id: `l00${k + 1}`, clientId: `seed-log-${k + 1}`, eventId: recent.id, volunteerId: s.volunteerId,
      items: [{ category: 'food-wrappers', count: 12 + k * 5 }, { category: 'bottle-caps', count: 30 + k * 3 }],
      bags: 1 + (k % 2), weightKg: 2.5 + k, note: k === 0 ? 'Lots of wrappers by the stairs.' : '', photoIds: [],
      recordedAt: `${recent.date}T${recent.endTime}:00.000Z`, createdAt: `${recent.date}T${recent.endTime}:00.000Z`,
    }))
    : []

  // hours from attendance
  for (const v of volunteers) {
    let minutes = 0
    for (const s of signups) {
      if (s.volunteerId !== v.id || s.status !== 'attended') continue
      const ev = events.find((e) => e.id === s.eventId)
      if (ev) minutes += toMinutes(ev.endTime) - toMinutes(ev.startTime)
    }
    v.hoursLogged = Math.round(minutes / 6) / 10
  }

  return { today, sites: SITES.map((s) => ({ ...s })), volunteers, events, signups, reports, logs }
}

export function toMinutes(time: string): number {
  const [h = 0, m = 0] = time.split(':').map(Number)
  return h * 60 + m
}
