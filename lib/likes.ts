import dbConnect from './mongodb'
import Like from '@/models/Like'

export interface LikeInfo {
  count: number
  liked: boolean
}

export type LikeInfoMap = Record<string, LikeInfo>

export async function getLikeInfo(
  keys: string[],
  visitorId: string | null,
): Promise<LikeInfoMap> {
  const result: LikeInfoMap = {}
  keys.forEach((k) => {
    result[k] = { count: 0, liked: false }
  })
  if (keys.length === 0) return result

  try {
    await dbConnect()

    const counts = await Like.aggregate<{ _id: string; count: number }>([
      { $match: { targetKey: { $in: keys } } },
      { $group: { _id: '$targetKey', count: { $sum: 1 } } },
    ])
    counts.forEach((c) => {
      if (result[c._id]) result[c._id].count = c.count
    })

    if (visitorId) {
      const mine = await Like.find(
        { targetKey: { $in: keys }, visitorId },
        { targetKey: 1 },
      ).lean()
      mine.forEach((m) => {
        if (result[m.targetKey]) result[m.targetKey].liked = true
      })
    }
  } catch (err) {
    console.error('좋아요 조회 실패:', err instanceof Error ? err.message : err)
  }
  return result
}
