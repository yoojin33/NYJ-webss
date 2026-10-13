import type { Metadata } from 'next'
import { getItems } from '@/lib/items'
import ItemList from '@/components/ItemList'
import AddItemButton from '@/components/AddItemButton'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: '과제 | 내 포트폴리오' }

export default async function Page() {
  const items = await getItems('assignment')

  return (
    <>
      <div className="page-head">
        <h1>과제</h1>
        <AddItemButton type="assignment" />
      </div>
      <p className="muted">수업 과제로 만든 웹사이트입니다.</p>
      <ItemList items={items} />
    </>
  )
}
