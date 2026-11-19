// Excerpts of shoreline-api/core/types.ts, the API's contract, copied byte for byte (the course app
// copies the whole file as src/api/types.ts; this lab needs only these declarations). Never edit them.

/** "YYYY-MM-DD" */
export type DateString = string
/** "HH:MM", 24-hour clock */
export type TimeString = string
/** ISO 8601 timestamp in UTC, e.g. "2026-03-14T16:05:00.000Z" */
export type Timestamp = string

export type EventStatus = 'draft' | 'scheduled' | 'completed' | 'cancelled'

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
