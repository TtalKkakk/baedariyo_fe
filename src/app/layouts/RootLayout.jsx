import { Outlet } from 'react-router-dom';

/**
 * RootLayout - 모바일 프레임 공통 레이아웃
 */
export default function RootLayout() {
  return (
    <div className="layout-page">
      <div className="layout-frame">
        <Outlet />
      </div>
    </div>
  );
}
