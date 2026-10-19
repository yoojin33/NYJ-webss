import { TEAM_PROJECT } from '@/lib/teamProject'
import { getLikeInfo } from '@/lib/likes'
import { getVisitorId } from '@/lib/visitor'
import { PROJECT_LIKE_KEY } from '@/lib/likeKeys'
import LikeButton from './LikeButton'

export default async function TeamProjectIntro() {
  const { title, summary, points, tags, sourceUrl, pageUrl } = TEAM_PROJECT
  const like = (await getLikeInfo([PROJECT_LIKE_KEY], getVisitorId()))[
    PROJECT_LIKE_KEY
  ]

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

      <div className="card-row">
        {sourceUrl || pageUrl ? (
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
        ) : (
          <span />
        )}
        <LikeButton
          targetKey={PROJECT_LIKE_KEY}
          initialCount={like.count}
          initialLiked={like.liked}
        />
      </div>
    </div>
  )
}
