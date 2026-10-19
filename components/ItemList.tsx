import { TYPE_LABELS } from '@/lib/constants'
import type { ItemView } from '@/lib/constants'
import type { LikeInfoMap } from '@/lib/likes'
import { itemLikeKey } from '@/lib/likeKeys'
import DeleteItemButton from './DeleteItemButton'
import EditItemButton from './EditItemButton'
import LikeButton from './LikeButton'

interface ItemListProps {
  items: ItemView[]
  emptyText?: string
  deletable?: boolean
  likeInfo?: LikeInfoMap
}

export default function ItemList({
  items,
  emptyText = '아직 등록된 항목이 없습니다.',
  deletable = false,
  likeInfo,
}: ItemListProps) {
  if (!items.length) return <p className="muted empty">{emptyText}</p>

  return (
    <ul className="list">
      {items.map((item) => {
        const key = itemLikeKey(item.id)
        const like = likeInfo?.[key]
        const hasLinks = Boolean(item.sourceUrl || item.pageUrl)

        return (
          <li key={item.id} data-type={item.type}>
            <span className="badge">{TYPE_LABELS[item.type]}</span>
            <span className="title">{item.title}</span>
            {item.description && <p>{item.description}</p>}
            <div>
              {item.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>

            {(hasLinks || like) && (
              <div className="card-row">
                {hasLinks ? (
                  <div className="btns">
                    {item.sourceUrl && (
                      <a
                        className="btn"
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        소스코드
                      </a>
                    )}
                    {item.pageUrl && (
                      <a
                        className="btn primary"
                        href={item.pageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        페이지 보기 ↗
                      </a>
                    )}
                  </div>
                ) : (
                  <span />
                )}
                {like && (
                  <LikeButton
                    targetKey={key}
                    initialCount={like.count}
                    initialLiked={like.liked}
                  />
                )}
              </div>
            )}

            {deletable && (
              <div className="item-foot">
                <div className="foot-actions">
                  <EditItemButton item={item} />
                  <DeleteItemButton id={item.id} />
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
