'use client'

import { useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { ItemType } from '@/lib/constants'

interface AddItemButtonProps {
  type: ItemType // 이 페이지에서 등록할 종류 (assignment | team)
}

const EMPTY = {
  title: '',
  description: '',
  sourceUrl: '',
  pageUrl: '',
  tags: '',
}

export default function AddItemButton({ type }: AddItemButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [form, setForm] = useState(EMPTY)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  function change(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ ...form, type }),
      })
      const data = await res.json()
      if (res.ok) {
        setForm(EMPTY)
        setPassword('')
        setOpen(false)
        router.refresh() // 서버에서 목록을 다시 불러와 새 카드가 바로 보이게 함
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
        aria-label="게시물 추가"
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
            <h2 style={{ marginTop: 0 }}>게시물 추가</h2>
            <div className="admin" style={{ display: 'grid', gap: 10 }}>
              <input
                name="title"
                placeholder="제목"
                value={form.title}
                onChange={change}
                maxLength={100}
              />
              <textarea
                name="description"
                placeholder="설명 (선택)"
                value={form.description}
                onChange={change}
                maxLength={500}
                rows={3}
              />
              <input
                name="sourceUrl"
                placeholder="소스코드 링크 (선택)"
                value={form.sourceUrl}
                onChange={change}
                maxLength={300}
              />
              <input
                name="pageUrl"
                placeholder="페이지 링크 (선택)"
                value={form.pageUrl}
                onChange={change}
                maxLength={300}
              />
              <input
                name="tags"
                placeholder="태그 (쉼표로 구분, 최대 5개)"
                value={form.tags}
                onChange={change}
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
                  {busy ? '저장 중...' : '게시'}
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
