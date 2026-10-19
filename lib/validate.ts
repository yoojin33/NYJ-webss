// 링크 검사: 비어 있으면 '' (버튼 숨김), 올바른 http/https 주소면 정규화된 주소, 아니면 null
// javascript: 같은 스킴은 여기서 걸러짐
export function parseUrl(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return ''
  if (typeof value !== 'string' || value.length > 300) return null
  try {
    const parsed = new URL(value.trim())
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : null
  } catch {
    return null
  }
}

// ---------- 게시물 ----------
export interface ItemFields {
  title: string
  description: string
  sourceUrl: string
  pageUrl: string
  tags: string[]
}

// 입력값 검증: 서버에서 반드시 다시 확인 (클라이언트 검증은 우회 가능)
// 허용한 필드만 골라서 돌려주므로, 요청에 다른 값이 섞여 있어도 DB에는 들어가지 않음
export function validateItemFields(
  body: Record<string, unknown>,
): { data: ItemFields } | { error: string } {
  const { title, description = '', sourceUrl, pageUrl, tags = '' } = body

  if (typeof title !== 'string' || !title.trim() || title.length > 100)
    return { error: '제목은 1~100자여야 합니다.' }
  if (typeof description !== 'string' || description.length > 500)
    return { error: '설명은 500자 이하여야 합니다.' }

  const source = parseUrl(sourceUrl)
  if (source === null)
    return { error: '소스코드 링크는 http 또는 https 주소여야 합니다.' }
  const page = parseUrl(pageUrl)
  if (page === null)
    return { error: '페이지 링크는 http 또는 https 주소여야 합니다.' }

  let rawTags: string[]
  if (typeof tags === 'string') {
    rawTags = tags.split(',')
  } else if (Array.isArray(tags) && tags.every((t) => typeof t === 'string')) {
    rawTags = tags as string[]
  } else {
    return { error: '태그 형식이 올바르지 않습니다.' }
  }
  const tagList = rawTags.map((t) => t.trim()).filter(Boolean)
  if (tagList.length > 5 || tagList.some((t) => t.length > 20))
    return { error: '태그는 최대 5개, 각 20자 이하입니다.' }

  return {
    data: {
      title: title.trim(),
      description: description.trim(),
      sourceUrl: source,
      pageUrl: page,
      tags: tagList,
    },
  }
}

// ---------- 팀원 ----------
export interface MemberFields {
  name: string
  role: string
  sourceUrl: string
  pageUrl: string
}

export function validateMemberFields(
  body: Record<string, unknown>,
): { data: MemberFields } | { error: string } {
  const { name, role = '', sourceUrl, pageUrl } = body

  if (typeof name !== 'string' || !name.trim() || name.length > 30)
    return { error: '이름은 1~30자여야 합니다.' }
  if (typeof role !== 'string' || role.length > 50)
    return { error: '역할은 50자 이하여야 합니다.' }

  const source = parseUrl(sourceUrl)
  if (source === null)
    return { error: '소스코드 링크는 http 또는 https 주소여야 합니다.' }
  const page = parseUrl(pageUrl)
  if (page === null)
    return { error: '페이지 링크는 http 또는 https 주소여야 합니다.' }

  return {
    data: {
      name: name.trim(),
      role: role.trim(),
      sourceUrl: source,
      pageUrl: page,
    },
  }
}
