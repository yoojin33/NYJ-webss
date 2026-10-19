export const PROJECT_LIKE_KEY = 'project:main'

export function itemLikeKey(id: string): string {
  return `item:${id}`
}

export type ParsedLikeKey = { kind: 'project' } | { kind: 'item'; id: string }

export function parseLikeKey(value: unknown): ParsedLikeKey | null {
  if (typeof value !== 'string') return null
  if (value === PROJECT_LIKE_KEY) return { kind: 'project' }
  const match = /^item:([0-9a-fA-F]{24})$/.exec(value)
  return match ? { kind: 'item', id: match[1] } : null
}
