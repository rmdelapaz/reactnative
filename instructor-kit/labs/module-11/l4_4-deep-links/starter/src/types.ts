// One cleanup, as shoreline-api sends it (shortened: the API sends more fields).
// fixtures/event-e08.json is a real answer of GET /api/events/e08, saved from the course API.
export interface CleanupEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingPoint: string;
  site: { id: string; name: string };
}
