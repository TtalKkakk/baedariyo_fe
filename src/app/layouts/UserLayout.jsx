import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets';

/**
 * UserLayout - 사용자(고객)용 레이아웃
 */
export default function UserLayout() {
  return (
    <>
      <Header />
      <main className="flex-1 min-h-0 overflow-auto">
        <Outlet />
      </main>
      {/* 필요시 BottomNavigation 추가 */}
    </>
  );
}
