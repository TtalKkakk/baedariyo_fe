import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets';

/**
 * RiderLayout - 라이더(배달원)용 레이아웃
 */
export default function RiderLayout() {
  return (
    <>
      <Header />
      <main className="flex-1 min-h-0 overflow-auto">
        <Outlet />
      </main>
      {/* 필요시 RiderNavigation 추가 */}
    </>
  );
}
