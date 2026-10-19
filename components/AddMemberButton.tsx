'use client'

import { useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'

const EMPTY = { name: '', role: '', sourceUrl: '', pageUrl: '' }

export default function AddMemberButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [form, setForm] = useState(EMPTY)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  function change(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function close() {
    setOpen(false)
    setMessage('')
  }

  async function submit() {
    setBusy(true)
    setMessage('')
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setForm(EMPTY)
        setPassword('')
        setOpen(false)
        router.refresh()
      } else {
        setMessage(data.error || '실패했습니다.')
      }
    } catch {
      setMessage('네트워크 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="add-btn"
        onClick={() => setOpen(true)}
        aria-label="팀원 추가"
      >
        +
      </button>

      {open && (
        <div className="modal-backdrop" onClick={close}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>팀원 추가</h2>
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
                placeholder="담당 역할 (선택, 예: 로그인·DB 설계)"
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
                  {busy ? '저장 중...' : '추가'}
                </button>
                <button type="button" className="ghost" onClick={close}>
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
