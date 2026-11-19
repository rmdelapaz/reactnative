// What a tap on a gear reminder may open. A notification's data comes from outside the app (today
// the app wrote it; tomorrow a server's push could): check it, and only ever open a loan's screen.

/** The path of one loan's screen: what a link, and a reminder, opens */
export function loanPath(id: string) {
  return `/loans/${id}` as const;
}

/** Is this a path to a loan's screen? Letters, digits, _ and - after /loans/, and nothing else */
export function isLoanPath(value: unknown): value is ReturnType<typeof loanPath> {
  return typeof value === 'string' && /^\/loans\/[\w-]+$/.test(value);
}

/** The screen a tap should open (response.notification.request.content.data), or null for none */
export function pathFromTap(data: Record<string, unknown> | undefined): ReturnType<typeof loanPath> | null {
  const url = data?.url;
  return isLoanPath(url) ? url : null;
}
