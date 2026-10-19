import { getMembers } from '@/lib/members'
import AddMemberButton from './AddMemberButton'
import EditMemberButton from './EditMemberButton'
import DeleteItemButton from './DeleteItemButton'
import TeamProjectIntro from './TeamProjectIntro'

// 서버 컴포넌트: React가 텍스트를 자동으로 이스케이프하므로 XSS에 안전하게 출력됨
export default async function TeamSection() {
  const members = await getMembers()

  return (
    <section>
      <div className="section-head">
        <h2>웹서버보안프로그래밍 팀 소개</h2>
      </div>

      {/* 팀 프로젝트 소개 */}
      <TeamProjectIntro />

      {/* 팀원 소개: 제목 + 설명 문구 바로 아래에 팀원 프로필 */}
      <div className="section-head sub">
        <h2>팀원 소개</h2>
        <AddMemberButton />
      </div>
      <p className="muted">팀원들의 프로필입니다. (팀원 {members.length}명)</p>

      {members.length === 0 ? (
        <p className="muted empty">
          아직 등록된 팀원이 없습니다. 오른쪽 + 버튼으로 추가하세요.
        </p>
      ) : (
        <div className="members">
          {members.map((m) => (
            <div className="member-card" key={m.id}>
              <span className="member-name">{m.name}</span>
              {m.role && <span className="member-role">{m.role}</span>}

              {(m.sourceUrl || m.pageUrl) && (
                <div className="btns">
                  {m.sourceUrl && (
                    <a
                      className="btn"
                      href={m.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      소스코드
                    </a>
                  )}
                  {m.pageUrl && (
                    <a
                      className="btn primary"
                      href={m.pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      포트폴리오 보기 ↗
                    </a>
                  )}
                </div>
              )}

              <div className="item-foot">
                <div className="foot-actions">
                  <EditMemberButton member={m} />
                  <DeleteItemButton id={m.id} basePath="/api/members" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
