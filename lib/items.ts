import dbConnect from './mongodb'
import Item, { IItem } from '@/models/Item'
import { PAGE_SIZE } from './constants'
import type { ItemType, ItemView } from './constants'

// DB 문서를 화면에서 쓰기 좋은 일반 객체로 변환
function toView(d: { _id: unknown } & IItem): ItemView {
  return {
    id: String(d._id),
    type: d.type,
    title: d.title,
    description: d.description,
    sourceUrl: d.sourceUrl ?? '',
    pageUrl: d.pageUrl ?? '',
    tags: d.tags,
  }
}

// 홈 화면 등에서 최근 항목을 가져올 때 사용
export async function getItems(
  type?: ItemType | null,
  limit = 0,
): Promise<ItemView[]> {
  try {
    await dbConnect()
    const query = type ? { type } : {}
    let q = Item.find(query).sort({ createdAt: -1, _id: -1 })
    if (limit) q = q.limit(limit)
    const docs = await q.lean()
    return docs.map(toView)
  } catch (err) {
    console.error('DB 조회 실패:', err instanceof Error ? err.message : err)
    return []
  }
}

export interface ItemPage {
  items: ItemView[]
  page: number // 실제로 보여 주는 페이지 (범위를 벗어난 요청은 보정됨)
  totalPages: number
  total: number
}

// 페이지 단위로 가져오기: page 는 1부터 시작
export async function getItemsPage(
  type: ItemType,
  page = 1,
  pageSize = PAGE_SIZE,
): Promise<ItemPage> {
  try {
    await dbConnect()
    const total = await Item.countDocuments({ type })
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const current = Math.min(Math.max(1, page), totalPages)

    const docs = await Item.find({ type })
      .sort({ createdAt: -1, _id: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .lean()

    return { items: docs.map(toView), page: current, totalPages, total }
  } catch (err) {
    console.error('DB 조회 실패:', err instanceof Error ? err.message : err)
    return { items: [], page: 1, totalPages: 1, total: 0 }
  }
}
