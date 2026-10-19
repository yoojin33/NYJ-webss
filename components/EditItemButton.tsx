'use client'

import { useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { ItemView } from '@/lib/constants'

interface EditItemButtonProps {
  item: ItemView
}

// 카드의 현재 값으로 입력 칸을 채움 (태그는 쉼표로 이어서 보여 줌)
function toForm(item: ItemView) {
  return {
    title: item.title,
    description: item.description,
    sourceUrl: item.sourceUrl,
    pageUrl: item.pageUrl,
    tags: item.tags.join(', '),
  }
}

export default function EditItemButton({ item }: EditItemButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [form, setForm] = useState(toForm(item))
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  function openModal() {
    setForm(toForm(item)) // 열 때마다 저장된 최신 값으로 다시 채움
    setPassword('')
    setMessage('')
    setOpen(true)
  }

  function change(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submit() {
    setBusy(true)
    setMessage('')
    try {
      const res = await fetch(`/api/items/${item.id}`, {
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
        router.refresh() // 수정한 내용이 바로 카드에 반영되게 함
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
            <h2 style={{ marginTop: 0 }}>게시물 수정</h2>
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
