'use client'

import { useEffect, useState, ChangeEvent } from 'react'
import { TYPES, TYPE_LABELS, ItemType, ItemView } from '@/lib/constants'

interface FormState {
  type: ItemType
  title: string
  description: string
  sourceUrl: string
  pageUrl: string
  tags: string
}

const EMPTY: FormState = {
  type: 'assignment',
  title: '',
  description: '',
  sourceUrl: '',
  pageUrl: '',
  tags: '',
}

export default function AdminPage() {
  const [password, setPassword] = useState<string>('')
  const [form, setForm] = useState<FormState>(EMPTY)
  const [items, setItems] = useState<ItemView[]>([])
  const [message, setMessage] = useState<string>('')

  async function load() {
    const res = await fetch('/api/items')
    if (res.ok) setItems(await res.json())
  }

  useEffect(() => {
    load()
  }, [])

  function change(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submit() {
    setMessage('')
    const res = await fetch('/api/items', {
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
      setMessage('추가되었습니다.')
      load()
    } else {
      setMessage(data.error || '실패했습니다.')
    }
  }

  async function remove(id: string) {
    if (!confirm('삭제할까요?')) return
    const res = await fetch(`/api/items/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password },
    })
    if (res.ok) load()
    else setMessage('삭제 실패 (비밀번호를 확인하세요)')
  }

  return (
    <>
      <h1>관리자</h1>
      <p className="muted">
        항목을 추가/삭제하려면 관리자 비밀번호가 필요합니다.
      </p>

      <div className="admin" style={{ display: 'grid', gap: 10 }}>
        <input
          type="password"
          placeholder="관리자 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div
        className="admin"
        style={{ display: 'grid', gap: 10, marginTop: 16 }}
      >
        <select name="type" value={form.type} onChange={change}>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <input
          name="title"
          placeholder="제목 (예: 3주차 실습과제)"
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
          placeholder="소스코드 링크 (GitHub 등, 선택)"
          value={form.sourceUrl}
          onChange={change}
          maxLength={300}
        />
        <input
          name="pageUrl"
          placeholder="페이지 링크 (배포된 사이트, 선택)"
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
        <button type="button" onClick={submit}>
          추가
        </button>
        {message && <div className="msg">{message}</div>}
      </div>

      <h2>등록된 항목</h2>
      <ul className="list">
        {items.map((item) => (
          <li key={item.id}>
            <div className="row">
              <div>
                <span className="tag">{TYPE_LABELS[item.type]}</span>
                {item.title}
              </div>
              <button
                type="button"
                className="danger"
                onClick={() => remove(item.id)}
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
