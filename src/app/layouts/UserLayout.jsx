import { Outlet, NavLink } from 'react-router-dom';
import { Header } from '@/widgets';

export default function UserLayout() {
  return (
    <>
      <Header />
      <main className="flex-1 min-h-0 overflow-auto">
        <Outlet />
      </main>
      <nav className="h-14 flex items-center justify-around border-t border-black/8 bg-white shrink-0">
        <NavLink to="/" className="flex flex-col items-center justify-center flex-1 h-full no-underline">
          {({ isActive }) => (
            <span className={`text-xs ${isActive ? 'font-bold text-[var(--color-atomic-neutral-10,#171717)]' : 'text-[var(--color-atomic-neutral-60,#8a8a8a)]'}`}>
              홈
            </span>
          )}
        </NavLink>
        <NavLink to="/orders" className="flex flex-col items-center justify-center flex-1 h-full no-underline">
          {({ isActive }) => (
            <span className={`text-xs ${isActive ? 'font-bold text-[var(--color-atomic-neutral-10,#171717)]' : 'text-[var(--color-atomic-neutral-60,#8a8a8a)]'}`}>
              주문내역
            </span>
          )}
        </NavLink>
        <NavLink to="/mypage" className="flex flex-col items-center justify-center flex-1 h-full no-underline">
          {({ isActive }) => (
            <span className={`text-xs ${isActive ? 'font-bold text-[var(--color-atomic-neutral-10,#171717)]' : 'text-[var(--color-atomic-neutral-60,#8a8a8a)]'}`}>
              마이페이지
            </span>
          )}
        </NavLink>
      </nav>
    </>
  );
}
