import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import { isAdmin } from '@/lib/auth';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }
  if (!mongoose.isValidObjectId(params.id)) {
    return NextResponse.json({ error: '잘못된 ID입니다.' }, { status: 400 });
  }

  await dbConnect();
  await Item.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
