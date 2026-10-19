import { cookies } from 'next/headers'

export const VISITOR_COOKIE = 'visitor_id'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function getVisitorId(): string | null {
  const value = cookies().get(VISITOR_COOKIE)?.value
  return value && UUID_RE.test(value) ? value : null
}
