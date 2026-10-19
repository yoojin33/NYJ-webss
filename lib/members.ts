import dbConnect from './mongodb'
import Member from '@/models/Member'
import type { MemberView } from './constants'

// 등록한 순서대로 가져오기
export async function getMembers(): Promise<MemberView[]> {
  try {
    await dbConnect()
    const docs = await Member.find().sort({ createdAt: 1, _id: 1 }).lean()
    return docs.map((d) => ({
      id: String(d._id),
      name: d.name,
      role: d.role ?? '',
      sourceUrl: d.sourceUrl ?? '',
      pageUrl: d.pageUrl ?? '',
    }))
  } catch (err) {
    console.error('팀원 조회 실패:', err instanceof Error ? err.message : err)
    return []
  }
}
