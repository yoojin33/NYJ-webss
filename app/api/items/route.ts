import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Item from '@/models/Item'
import { isAdmin } from '@/lib/auth'
import { validateItemFields } from '@/lib/validate'
import { TYPES, ItemType, ItemView } from '@/lib/constants'

export async function GET() {
  await dbConnect()
  const docs = await Item.find().sort({ createdAt: -1, _id: -1 }).lean()
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
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }
  const record = body as Record<string, unknown>

  const type = record.type
  if (
    typeof type !== 'string' ||
    !(TYPES as readonly string[]).includes(type)
  ) {
    return NextResponse.json(
      { error: '유효하지 않은 종류입니다.' },
      { status: 400 },
    )
  }

  const result = validateItemFields(record)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  await dbConnect()
  const created = await Item.create({ ...result.data, type: type as ItemType })
  return NextResponse.json({ id: String(created._id) }, { status: 201 })
}
