'use client'

import { useState } from 'react'

interface LikeButtonProps {
  targetKey: string
  initialCount: number
  initialLiked: boolean
}

export default function LikeButton({
  targetKey,
  initialCount,
  initialLiked,
}: LikeButtonProps) {
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(initialLiked)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function toggle() {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetKey }),
      })
      const data = await res.json()
      if (res.ok) {
        setLiked(data.liked)
        setCount(data.count)
      } else {
        setError(data.error || '실패했습니다.')
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <span className="like-wrap">
      {error && <span className="msg">{error}</span>}
      <button
        type="button"
        className={`like-btn${liked ? ' liked' : ''}`}
        onClick={toggle}
        disabled={busy}
        aria-pressed={liked}
        aria-label={liked ? '좋아요 취소' : '좋아요'}
      >
        <span aria-hidden="true">{liked ? '♥' : '♡'}</span> {count}
      </button>
    </span>
  )
}
