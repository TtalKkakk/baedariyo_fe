import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';

/**
 * UserLayout - 사용자(고객)용 레이아웃
 */
export default function UserLayout() {
  return (
    <>
      <Header />
      <main style={mainStyle}>
        <Outlet />
      </main>
      {/* 필요시 BottomNavigation 추가 */}
    </>
  );
}

const mainStyle = {
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
};
