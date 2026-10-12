import { GITHUB_URL, BLOG_URL } from '@/lib/links'

const LINKS = [
  { label: 'GitHub', desc: '소스 코드 보러가기', href: GITHUB_URL },
  { label: '블로그', desc: '블로그 보러가기', href: BLOG_URL },
]

// 외부 사이트로 이동하는 카드. 새 탭으로 열고 noopener/noreferrer 로 보호
export default function ExternalLinks() {
  return (
    <div className="linkcards">
      {LINKS.map((l) => (
        <a
          key={l.label}
          className="linkcard"
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="linkcard-label">{l.label}</span>
          <span className="linkcard-desc">{l.desc}</span>
          <span className="arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      ))}
    </div>
  )
}
