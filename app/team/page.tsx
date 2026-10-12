import type { Metadata } from 'next';
import { getItems } from '@/lib/items';
import ItemList from '@/components/ItemList';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: '팀 프로젝트 | 내 포트폴리오' };

export default async function Page() {
  const items = await getItems('team');

  return (
    <>
      <h1>팀 프로젝트</h1>
      <p className="muted">팀원들과 함께 만든 웹페이지입니다.</p>
      <ItemList items={items} />
    </>
  );
}
