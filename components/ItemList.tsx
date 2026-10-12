import { TYPE_LABELS } from '@/lib/constants'
import type { ItemView } from '@/lib/constants'

interface ItemListProps {
  items: ItemView[]
  emptyText?: string
}

// 서버 컴포넌트: React가 텍스트를 자동으로 이스케이프하므로 XSS에 안전하게 출력됨
export default function ItemList({
  items,
  emptyText = '아직 등록된 항목이 없습니다.',
}: ItemListProps) {
  if (!items.length) return <p className="muted empty">{emptyText}</p>

  return (
    <ul className="list">
      {items.map((item) => (
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

          {/* 링크를 입력한 버튼만 표시 */}
          {(item.sourceUrl || item.pageUrl) && (
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
          )}
        </li>
      ))}
    </ul>
  )
}
