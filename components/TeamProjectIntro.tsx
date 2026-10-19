import { TEAM_PROJECT } from '@/lib/teamProject'

// 서버 컴포넌트: 내용은 lib/teamProject.ts 에 고정되어 있고, 화면에서 추가·수정하는 기능은 없음
// React가 텍스트를 자동으로 이스케이프하므로 XSS에 안전하게 출력됨
export default function TeamProjectIntro() {
  const { title, summary, points, tags, sourceUrl, pageUrl } = TEAM_PROJECT

  return (
    <div className="project-card">
      <span className="badge">웹서버보안프로그래밍 팀 프로젝트</span>
      <h3 className="project-title">{title}</h3>
      <p>{summary}</p>

      {points.length > 0 && (
        <ul className="project-points">
          {points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}

      <div>
        {tags.map((t) => (
          <span className="tag" key={t}>
            {t}
          </span>
        ))}
      </div>

      {/* 링크를 입력한 버튼만 표시 */}
      {(sourceUrl || pageUrl) && (
        <div className="btns">
          {sourceUrl && (
            <a
              className="btn"
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              소스코드
            </a>
          )}
          {pageUrl && (
            <a
              className="btn primary"
              href={pageUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              웹사이트 보기 ↗
            </a>
          )}
        </div>
      )}
    </div>
  )
}
