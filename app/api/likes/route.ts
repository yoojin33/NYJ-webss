import crypto from 'crypto'
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Like from '@/models/Like'
import Item from '@/models/Item'
import { parseLikeKey } from '@/lib/likeKeys'
import { getVisitorId, VISITOR_COOKIE } from '@/lib/visitor'

const MAX_LIKES_PER_MINUTE = 20

function hashIp(request: Request): string {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local'
  return crypto
    .createHmac('sha256', process.env.ADMIN_PASSWORD ?? 'portfolio')
    .update(ip)
    .digest('hex')
    .slice(0, 32)
}

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { code?: number }).code === 11000
  )
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'JSON 형식이 아닙니다.' },
      { status: 400 },
    )
  }

  const target = parseLikeKey(
    body && typeof body === 'object'
      ? (body as Record<string, unknown>).targetKey
      : null,
  )
  if (!target) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }
  const targetKey =
    target.kind === 'project' ? 'project:main' : `item:${target.id}`

  await dbConnect()

  if (target.kind === 'item' && !(await Item.exists({ _id: target.id }))) {
    return NextResponse.json(
      { error: '게시물을 찾을 수 없습니다.' },
      { status: 404 },
    )
  }

  let visitorId = getVisitorId()
  const isNewVisitor = !visitorId
  if (!visitorId) visitorId = crypto.randomUUID()

  let liked: boolean
  const existing = await Like.findOne(
    { targetKey, visitorId },
    { _id: 1 },
  ).lean()

  if (existing) {
    await Like.deleteOne({ _id: existing._id })
    liked = false
  } else {
    const ipHash = hashIp(request)
    const recent = await Like.countDocuments({
      ipHash,
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    })
    if (recent >= MAX_LIKES_PER_MINUTE) {
      return NextResponse.json(
        { error: '요청이 너무 많습니다. 잠시 후 다시 시도하세요.' },
        { status: 429 },
      )
    }

    try {
      await Like.create({ targetKey, visitorId, ipHash })
    } catch (err) {
      if (!isDuplicateKeyError(err)) throw err
    }
    liked = true
  }

  const count = await Like.countDocuments({ targetKey })
  const response = NextResponse.json({ liked, count })

  if (isNewVisitor) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })
  }
  return response
}
