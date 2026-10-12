import Link from 'next/link'
import { getItems } from '@/lib/items'
import ExternalLinks from '@/components/ExternalLinks'
import ItemList from '@/components/ItemList'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const recent = await getItems(null, 5)

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Web Server Security · Portfolio</p>
        <h1>
          안녕하세요,
          <br />
          <span className="mark">남유진</span>의 포트폴리오입니다.
        </h1>
        <p className="muted">
          웹서버보안프로그래밍 수업에서 배운 내용으로 만든 사이트입니다. <br />
          코드와 공부 기록은 아래 링크에서 볼 수 있습니다.
        </p>
        <ExternalLinks />
      </section>

      <h2>둘러보기</h2>
      <div className="linkcards">
        <Link href="/assignments" className="linkcard">
          <span className="linkcard-label">과제</span>
          <span className="linkcard-desc">수업 과제로 만든 웹사이트</span>
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </Link>
        <Link href="/team" className="linkcard">
          <span className="linkcard-label">팀 프로젝트</span>
          <span className="linkcard-desc">팀원들과 함께 만든 웹페이지</span>
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>

      <h2>최근 추가된 항목</h2>
      <ItemList items={recent} />
    </>
  )
}
