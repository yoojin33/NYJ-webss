'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteItemButtonProps {
  id: string
}

export default function DeleteItemButton({ id }: DeleteItemButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  function cancel() {
    setOpen(false)
    setPassword('')
    setMessage('')
  }

  async function remove() {
    setBusy(true)
    setMessage('')
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password },
      })
      if (res.ok) {
        cancel()
        router.refresh() // 목록을 다시 불러와 카드가 바로 사라지게 함
      } else {
        const data = await res.json().catch(() => ({}))
        setMessage(data.error || '삭제에 실패했습니다.')
      }
    } catch {
      setMessage('네트워크 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  if (!open) {
    return (
      <button type="button" className="danger" onClick={() => setOpen(true)}>
        삭제
      </button>
    )
  }

  return (
    <div>
      <div className="del-form">
        <input
          type="password"
          placeholder="관리자 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !busy) remove()
          }}
          autoComplete="off"
          autoFocus
        />
        <button
          type="button"
          className="danger-solid"
          onClick={remove}
          disabled={busy}
        >
          {busy ? '삭제 중...' : '삭제 확인'}
        </button>
        <button type="button" className="ghost" onClick={cancel}>
          취소
        </button>
      </div>
      {message && <div className="msg">{message}</div>}
    </div>
  )
}
