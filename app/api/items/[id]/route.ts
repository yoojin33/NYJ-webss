import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/mongodb'
import Item from '@/models/Item'
import { isAdmin } from '@/lib/auth'
import { validateItemFields } from '@/lib/validate'

type Context = { params: { id: string } }

// 수정: 제목·설명·링크·태그만 바꿀 수 있음 (종류는 그대로)
export async function PATCH(request: Request, { params }: Context) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 })
  }
  if (!mongoose.isValidObjectId(params.id)) {
    return NextResponse.json({ error: '잘못된 ID입니다.' }, { status: 400 })
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

  const result = validateItemFields(body as Record<string, unknown>)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  await dbConnect()
  const updated = await Item.findByIdAndUpdate(
    params.id,
    { $set: result.data },
    { new: true, runValidators: true },
  )
  if (!updated) {
    return NextResponse.json(
      { error: '항목을 찾을 수 없습니다.' },
      { status: 404 },
    )
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request, { params }: Context) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 })
  }
  if (!mongoose.isValidObjectId(params.id)) {
    return NextResponse.json({ error: '잘못된 ID입니다.' }, { status: 400 })
  }

  await dbConnect()
  await Item.findByIdAndDelete(params.id)
  return NextResponse.json({ ok: true })
}
