import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Member from '@/models/Member'
import { isAdmin } from '@/lib/auth'
import { validateMemberFields } from '@/lib/validate'
import { MAX_MEMBERS, MemberView } from '@/lib/constants'

export async function GET() {
  await dbConnect()
  const docs = await Member.find().sort({ createdAt: 1, _id: 1 }).lean()
  const members: MemberView[] = docs.map((d) => ({
    id: String(d._id),
    name: d.name,
    role: d.role ?? '',
    sourceUrl: d.sourceUrl ?? '',
    pageUrl: d.pageUrl ?? '',
  }))
  return NextResponse.json(members)
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

  const result = validateMemberFields(body as Record<string, unknown>)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  await dbConnect()
  if ((await Member.countDocuments()) >= MAX_MEMBERS) {
    return NextResponse.json(
      { error: `팀원은 최대 ${MAX_MEMBERS}명까지 등록할 수 있습니다.` },
      { status: 400 },
    )
  }

  const created = await Member.create(result.data)
  return NextResponse.json({ id: String(created._id) }, { status: 201 })
}
