import Link from 'next/link'
import { getPageList } from '@/lib/pagination'

interface PaginationProps {
  page: number // 현재 페이지
  totalPages: number
  basePath: string // 예: '/assignments'
}

export default function Pagination({
  page,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null // 한 페이지뿐이면 표시하지 않음

  const href = (p: number) => (p === 1 ? basePath : `${basePath}?page=${p}`)

  return (
    <div className="pagination" role="navigation" aria-label="페이지 이동">
      {page > 1 ? (
        <Link
          className="page-link"
          href={href(page - 1)}
          aria-label="이전 페이지"
        >
          ‹
        </Link>
      ) : (
        <span className="page-link disabled" aria-hidden="true">
          ‹
        </span>
      )}

      {getPageList(page, totalPages).map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="page-gap">
            …
          </span>
        ) : p === page ? (
          <span key={p} className="page-link current" aria-current="page">
            {p}
          </span>
        ) : (
          <Link key={p} className="page-link" href={href(p)}>
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          className="page-link"
          href={href(page + 1)}
          aria-label="다음 페이지"
        >
          ›
        </Link>
      ) : (
        <span className="page-link disabled" aria-hidden="true">
          ›
        </span>
      )}
    </div>
  )
}
