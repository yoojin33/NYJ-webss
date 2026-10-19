export const TYPES = ['assignment', 'team'] as const

export type ItemType = (typeof TYPES)[number]

export const TYPE_LABELS: Record<ItemType, string> = {
  assignment: '과제',
  team: '팀 프로젝트',
}

export const PAGE_SIZE = 2 // 한 페이지에 보여 줄 게시물 수
export const MAX_MEMBERS = 8 // 등록할 수 있는 팀원 수 상한

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

// 팀원 정보
export interface MemberView {
  id: string
  name: string
  role: string
  sourceUrl: string
  pageUrl: string
}
