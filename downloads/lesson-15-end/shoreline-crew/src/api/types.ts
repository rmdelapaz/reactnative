// Shoreline Crew API: the shared types.
//
// This file is the contract between the API and every app that talks to it. The organizers' web app
// (React + TypeScript course, "Shoreline Crew HQ") and the volunteers' phone app (React Native course)
// copy it as src/api/types.ts. It only contains types, so it adds nothing to a bundle.
//
// Dates are plain strings in the group's local time (see Meta.timeZone):
//   a date is "YYYY-MM-DD", a time of day is "HH:MM" (24-hour), a timestamp is ISO 8601 in UTC.

/** "YYYY-MM-DD" */
export type DateString = string
/** "HH:MM", 24-hour clock */
export type TimeString = string
/** ISO 8601 timestamp in UTC, e.g. "2026-03-14T16:05:00.000Z" */
export type Timestamp = string

export type Role = 'organizer' | 'volunteer'

export type Terrain = 'sand' | 'rocky' | 'marsh' | 'mixed'

export type EventStatus = 'draft' | 'scheduled' | 'completed' | 'cancelled'

export type SignupStatus = 'confirmed' | 'waitlisted' | 'cancelled' | 'attended' | 'no-show'

export type Skill = 'first-aid' | 'boat-handling' | 'heavy-lifting' | 'photography' | 'data-recording' | 'team-lead'

export type DebrisCategory =
  | 'plastic-bottles'
  | 'plastic-bags'
  | 'food-wrappers'
  | 'bottle-caps'
  | 'cigarette-butts'
  | 'fishing-gear'
  | 'glass'
  | 'metal'
  | 'foam'
  | 'other'

/** A beach or shoreline where the crew holds cleanups. */
export interface Site {
  id: string
  name: string
  town: string
  terrain: Terrain
  /** step-free route to the meeting point */
  accessible: boolean
  latitude: number
  longitude: number
  parking: string
  description: string
  /** an illustration of the site, served by the API (absolute URL) */
  image: { url: string; alt: string; width: number; height: number }
}

/** A cleanup event. Volunteers only ever see 'scheduled', 'completed' and 'cancelled' events. */
export interface CleanupEvent {
  id: string
  title: string
  siteId: string
  status: EventStatus
  date: DateString
  startTime: TimeString
  endTime: TimeString
  capacity: number
  /** confirmed + attended sign-ups (computed by the API) */
  spotsTaken: number
  meetingPoint: string
  description: string
  suppliesProvided: string[]
  leadOrganizerId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

/** A cleanup event with its site, as GET /api/events/:id returns it. */
export interface CleanupEventDetail extends CleanupEvent {
  site: Site
  /** only present for organizers: the code volunteers type to check in on the day */
  checkInCode?: string
}

/** A person in the crew. Organizers are volunteers with extra permissions. */
export interface Volunteer {
  id: string
  name: string
  email: string
  phone: string | null
  role: Role
  skills: Skill[]
  joinedOn: DateString
  /** hours from attended cleanups */
  hoursLogged: number
}

/** The signed-in person, as the auth endpoints return them. */
export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export interface Signup {
  id: string
  eventId: string
  volunteerId: string
  status: SignupStatus
  note: string
  createdAt: Timestamp
  checkedInAt: Timestamp | null
}

/** A sign-up with the volunteer's name, as an event roster lists it (organizers only). */
export interface RosterEntry extends Signup {
  volunteer: Pick<Volunteer, 'id' | 'name' | 'email' | 'phone' | 'skills'>
}

export interface DebrisCount {
  category: DebrisCategory
  count: number
}

/** What one volunteer (or team) recorded at a cleanup. Sent from the phone app, possibly much later (offline). */
export interface CleanupLog {
  id: string
  /** made by the client so a retried upload is not saved twice */
  clientId: string
  eventId: string
  volunteerId: string
  items: DebrisCount[]
  bags: number
  weightKg: number
  note: string
  photoIds: string[]
  recordedAt: Timestamp
  createdAt: Timestamp
}

/** The organizers' summary of a completed cleanup. */
export interface ImpactReport {
  eventId: string
  volunteersAttended: number
  bags: number
  weightKg: number
  items: DebrisCount[]
  notes: string
  photoIds: string[]
  submittedAt: Timestamp
}

export interface ImpactTotals {
  from: DateString | null
  to: DateString | null
  events: number
  volunteerHours: number
  volunteersAttended: number
  bags: number
  weightKg: number
  byCategory: Record<DebrisCategory, number>
  byMonth: Array<{ month: string; events: number; weightKg: number }>
  bySite: Array<{ siteId: string; events: number; weightKg: number }>
}

export interface Photo {
  id: string
  url: string
  contentType: string
  bytes: number
  uploadedBy: string
  createdAt: Timestamp
}

export interface Meta {
  organization: string
  tagline: string
  timeZone: string
  today: DateString
  skills: Array<{ id: Skill; label: string }>
  debrisCategories: Array<{ id: DebrisCategory; label: string }>
  apiVersion: string
}

// ---------------------------------------------------------------------------------------------- requests

export interface SignInRequest {
  email: string
  password: string
}

export interface SignInResponse {
  token: string
  user: User
}

/** POST /api/events (organizers). Optional fields get defaults. */
export interface NewEvent {
  title: string
  siteId: string
  date: DateString
  startTime: TimeString
  endTime: TimeString
  capacity: number
  meetingPoint: string
  description?: string
  suppliesProvided?: string[]
  status?: 'draft' | 'scheduled'
}

/** PATCH /api/events/:id (organizers): any subset of the editable fields. */
export type EventChanges = Partial<Omit<NewEvent, 'status'>> & { status?: EventStatus }

export interface NewSignup {
  note?: string
}

export interface SignupChanges {
  status: SignupStatus
}

export interface CheckInRequest {
  code: string
}

export interface NewCleanupLog {
  clientId: string
  items: DebrisCount[]
  bags: number
  weightKg: number
  note?: string
  photoIds?: string[]
  recordedAt: Timestamp
}

export interface NewImpactReport {
  volunteersAttended: number
  bags: number
  weightKg: number
  items: DebrisCount[]
  notes?: string
  photoIds?: string[]
}

// ---------------------------------------------------------------------------------------------- lists and errors

/** Query parameters of GET /api/events. Every list also takes page (from 1) and perPage (1-50, default 10). */
export interface EventQuery {
  page?: number
  perPage?: number
  /** words in the title, description or site name */
  q?: string
  status?: EventStatus
  siteId?: string
  /** 'upcoming' = today or later, 'past' = before today */
  when?: 'upcoming' | 'past'
  from?: DateString
  to?: DateString
  /** only events changed after this timestamp (for syncing a phone) */
  updatedSince?: Timestamp
  /** 'date' (default, soonest first), '-date', 'title' */
  sort?: 'date' | '-date' | 'title'
}

export interface VolunteerQuery {
  page?: number
  perPage?: number
  q?: string
  skill?: Skill
  role?: Role
}

/** What the pagination headers say (X-Total-Count, X-Total-Pages, Link). */
export interface PageInfo {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export type ErrorCode =
  | 'validation_failed'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'payload_too_large'
  | 'unsupported_media_type'
  | 'method_not_allowed'
  | 'server_error'

/** Every error response has this body. fieldErrors only on 400 validation_failed. */
export interface ApiErrorBody {
  error: ErrorCode
  message: string
  fieldErrors?: Record<string, string[]>
}
