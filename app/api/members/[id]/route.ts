import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/mongodb'
import Member from '@/models/Member'
import { isAdmin } from '@/lib/auth'
import { validateMemberFields } from '@/lib/validate'

type Context = { params: { id: string } }

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

  const result = validateMemberFields(body as Record<string, unknown>)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  await dbConnect()
  const updated = await Member.findByIdAndUpdate(
    params.id,
    { $set: result.data },
    { new: true, runValidators: true },
  )
  if (!updated) {
    return NextResponse.json(
      { error: '팀원을 찾을 수 없습니다.' },
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
  await Member.findByIdAndDelete(params.id)
  return NextResponse.json({ ok: true })
}
