// The two shapes this lab uses, as shoreline-api sends them (shortened: the API sends more fields).
// fixtures/volunteers.json and fixtures/upcoming.json are real answers of GET /api/volunteers (as the organizer)
// and GET /api/events?when=upcoming, saved from the course API.
export interface Volunteer {
  id: string;
  name: string;
  role: 'volunteer' | 'organizer';
}

export interface CleanupEvent {
  id: string;
  title: string;
  meetingPoint: string;
}
