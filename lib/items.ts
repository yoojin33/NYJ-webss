import dbConnect from './mongodb'
import Item from '@/models/Item'
import type { ItemType, ItemView } from './constants'

// DB 문서를 화면에서 쓰기 좋은 일반 객체로 변환
export async function getItems(
  type?: ItemType | null,
  limit = 0,
): Promise<ItemView[]> {
  try {
    await dbConnect()
    const query = type ? { type } : {}
    let q = Item.find(query).sort({ createdAt: -1 })
    if (limit) q = q.limit(limit)
    const docs = await q.lean()
    return docs.map((d) => ({
      id: String(d._id),
      type: d.type,
      title: d.title,
      description: d.description,
      sourceUrl: d.sourceUrl ?? '',
      pageUrl: d.pageUrl ?? '',
      tags: d.tags,
    }))
  } catch (err) {
    console.error('DB 조회 실패:', err instanceof Error ? err.message : err)
    return []
  }
}
