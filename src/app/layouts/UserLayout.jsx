import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

export default function UserLayout() {
  return (
    <>
      <Header />
      <main className="flex-1 min-h-0 overflow-auto">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}
