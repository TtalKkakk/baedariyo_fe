import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

export default function UserLayout() {
  return (
    <div id="user-layout-root" className="relative flex flex-col flex-1 min-h-0">
      <Header />
      <main className="flex-1 min-h-0 overflow-auto px-4 py-2">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
