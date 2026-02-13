import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';

/**
 * RiderLayout - 라이더(배달원)용 레이아웃
 */
export default function RiderLayout() {
  return (
    <>
      <Header />
      <main style={mainStyle}>
        <Outlet />
      </main>
      {/* 필요시 RiderNavigation 추가 */}
    </>
  );
}

const mainStyle = {
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
};
