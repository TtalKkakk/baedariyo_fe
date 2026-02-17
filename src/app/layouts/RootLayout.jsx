import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="layout-page">
      <div className="layout-frame">
        <Outlet />
      </div>
    </div>
  );
}
