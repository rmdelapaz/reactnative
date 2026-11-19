// "Apr 2, 2030" in the phone's own time zone (the Intl API works the same on Hermes and the web)
const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function formatDate(timestamp: string): string {
  return dateFormat.format(new Date(timestamp));
}
