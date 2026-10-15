import type { Metadata } from 'next'
import { getItems } from '@/lib/items'
import ItemList from '@/components/ItemList'
import AddItemButton from '@/components/AddItemButton'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: '팀 프로젝트 | 내 포트폴리오' }

export default async function Page() {
  const items = await getItems('team')

  return (
    <>
      <div className="page-head">
        <h1>팀 프로젝트</h1>
        <AddItemButton type="team" />
      </div>
      <p className="muted">팀원들과 함께 만든 웹페이지입니다.</p>
      <ItemList items={items} deletable />
    </>
  )
}
