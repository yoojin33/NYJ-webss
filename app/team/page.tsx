import type { Metadata } from 'next'
import { getItemsPage } from '@/lib/items'
import { parsePage } from '@/lib/pagination'
import ItemList from '@/components/ItemList'
import AddItemButton from '@/components/AddItemButton'
import Pagination from '@/components/Pagination'
import TeamSection from '@/components/TeamSection'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: '팀 프로젝트 | 내 포트폴리오' }

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string | string[] }
}) {
  const { items, page, totalPages } = await getItemsPage(
    'team',
    parsePage(searchParams.page),
  )

  return (
    <>
      <div className="page-head">
        <h1>팀 프로젝트</h1>
        <AddItemButton type="team" />
      </div>
      <p className="muted">다양한 팀원들과 함께 만든 웹페이지입니다.</p>
      <ItemList items={items} deletable />
      <Pagination page={page} totalPages={totalPages} basePath="/team" />

      <TeamSection />
    </>
  )
}
