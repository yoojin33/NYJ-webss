'use client'

import { useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { MemberView } from '@/lib/constants'

interface EditMemberButtonProps {
  member: MemberView
}

function toForm(member: MemberView) {
  return {
    name: member.name,
    role: member.role,
    sourceUrl: member.sourceUrl,
    pageUrl: member.pageUrl,
  }
}

export default function EditMemberButton({ member }: EditMemberButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [form, setForm] = useState(toForm(member))
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  function openModal() {
    setForm(toForm(member))
    setPassword('')
    setMessage('')
    setOpen(true)
  }

  function change(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submit() {
    setBusy(true)
    setMessage('')
    try {
      const res = await fetch(`/api/members/${member.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setPassword('')
        setOpen(false)
        router.refresh()
      } else {
        setMessage(data.error || '수정에 실패했습니다.')
      }
    } catch {
      setMessage('네트워크 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button type="button" className="edit" onClick={openModal}>
        수정
      </button>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>팀원 수정</h2>
            <div className="admin" style={{ display: 'grid', gap: 10 }}>
              <input
                name="name"
                placeholder="이름"
                value={form.name}
                onChange={change}
                maxLength={30}
              />
              <input
                name="role"
                placeholder="담당 역할 (선택)"
                value={form.role}
                onChange={change}
                maxLength={50}
              />
              <input
                name="sourceUrl"
                placeholder="포트폴리오 소스코드 링크 (선택)"
                value={form.sourceUrl}
                onChange={change}
                maxLength={300}
              />
              <input
                name="pageUrl"
                placeholder="포트폴리오 페이지 링크 (선택)"
                value={form.pageUrl}
                onChange={change}
                maxLength={300}
              />
              <input
                type="password"
                placeholder="관리자 비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
              />
              {message && <div className="msg">{message}</div>}
              <div className="btns">
                <button type="button" onClick={submit} disabled={busy}>
                  {busy ? '저장 중...' : '저장'}
                </button>
                <button
                  type="button"
                  className="ghost"
                  onClick={() => setOpen(false)}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
