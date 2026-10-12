export const TYPES = ['assignment', 'team'] as const

export type ItemType = (typeof TYPES)[number]

export const TYPE_LABELS: Record<ItemType, string> = {
  assignment: '과제',
  team: '팀 프로젝트',
}

// 화면에서 사용하는 항목 형태
export interface ItemView {
  id: string
  type: ItemType
  title: string
  description: string
  sourceUrl: string // 소스코드 링크 (없으면 빈 문자열)
  pageUrl: string // 웹페이지 링크 (없으면 빈 문자열)
  tags: string[]
}
