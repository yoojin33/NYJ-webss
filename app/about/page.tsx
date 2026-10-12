import type { Metadata } from 'next'
import ExternalLinks from '@/components/ExternalLinks'

export const metadata: Metadata = { title: '소개 | 내 포트폴리오' }

export default function About() {
  return (
    <>
      <p className="eyebrow">About</p>
      <h1>소개</h1>

      <h2>기본 정보</h2>
      <ul className="info">
        <li>
          <strong>이름</strong> 남유진
        </li>
        <li>
          <strong>학교/전공</strong> 중부대학교 정보보호학전공 
        </li>
        <li>
          <strong>관심 분야</strong> 웹 개발, 정보보호
        </li>
        <li>
          <strong>연락처</strong> your-email@example.com
        </li>
      </ul>

      <h2>사용 기술</h2>
      <div>
        {['React', 'Next.js', 'TypeScript', 'MongoDB', 'Mongoose'].map((t) => (
          <span className="tag" key={t}>
            {t}
          </span>
        ))}
      </div>

      <h2>링크</h2>
      <ExternalLinks />
    </>
  )
}
