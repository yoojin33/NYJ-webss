import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Item from '@/models/Item'
import { isAdmin } from '@/lib/auth'
import { TYPES, ItemType, ItemView } from '@/lib/constants'

interface NewItem {
  type: ItemType
  title: string
  description: string
  sourceUrl: string
  pageUrl: string
  tags: string[]
}

type ValidationResult = { data: NewItem } | { error: string }

// 링크 검사: 비어 있으면 '' (버튼 숨김), 올바른 http/https 주소면 정규화된 주소, 아니면 null
// javascript: 같은 스킴은 여기서 걸러짐
function parseUrl(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return ''
  if (typeof value !== 'string' || value.length > 300) return null
  try {
    const parsed = new URL(value.trim())
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : null
  } catch {
    return null
  }
}

// 입력값 검증: 서버에서 반드시 다시 확인 (클라이언트 검증은 우회 가능)
function validate(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') return { error: '잘못된 요청입니다.' }

  const {
    type,
    title,
    description = '',
    sourceUrl,
    pageUrl,
    tags = '',
  } = body as Record<string, unknown>

  if (typeof type !== 'string' || !(TYPES as readonly string[]).includes(type))
    return { error: '유효하지 않은 종류입니다.' }
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

  const tagList = String(tags)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  if (tagList.length > 5 || tagList.some((t) => t.length > 20))
    return { error: '태그는 최대 5개, 각 20자 이하입니다.' }

  return {
    data: {
      type: type as ItemType,
      title: title.trim(),
      description: description.trim(),
      sourceUrl: source,
      pageUrl: page,
      tags: tagList,
    },
  }
}

export async function GET() {
  await dbConnect()
  const docs = await Item.find().sort({ createdAt: -1 }).lean()
  const items: ItemView[] = docs.map((d) => ({
    id: String(d._id),
    type: d.type,
    title: d.title,
    description: d.description,
    sourceUrl: d.sourceUrl ?? '',
    pageUrl: d.pageUrl ?? '',
    tags: d.tags,
  }))
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'JSON 형식이 아닙니다.' },
      { status: 400 },
    )
  }

  const result = validate(body)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  await dbConnect()
  const created = await Item.create(result.data)
  return NextResponse.json({ id: String(created._id) }, { status: 201 })
}
