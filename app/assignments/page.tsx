import type { Metadata } from 'next'
import { getItemsPage } from '@/lib/items'
import { parsePage } from '@/lib/pagination'
import ItemList from '@/components/ItemList'
import AddItemButton from '@/components/AddItemButton'
import Pagination from '@/components/Pagination'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: '과제 | 내 포트폴리오' }

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string | string[] }
}) {
  const { items, page, totalPages } = await getItemsPage(
    'assignment',
    parsePage(searchParams.page),
  )

  return (
    <>
      <div className="page-head">
        <h1>과제</h1>
        <AddItemButton type="assignment" />
      </div>
      <p className="muted">수업 과제, 발표용으로 만든 웹사이트입니다.</p>
      <ItemList items={items} deletable />
      <Pagination page={page} totalPages={totalPages} basePath="/assignments" />
    </>
  )
}
