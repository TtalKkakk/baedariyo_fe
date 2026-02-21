import { Outlet, NavLink } from 'react-router-dom';
import Header from './Header';

export default function RiderLayout() {
  return (
    <>
      <Header />
      <main className="flex-1 min-h-0 overflow-auto">
        <Outlet />
      </main>
      <nav className="h-14 flex items-center justify-around border-t border-black/8 bg-white shrink-0">
        <NavLink to="/rider" end className="flex flex-col items-center justify-center flex-1 h-full no-underline">
          {({ isActive }) => (
            <span className={`text-xs ${isActive ? 'font-bold text-[var(--color-atomic-neutral-10,#171717)]' : 'text-[var(--color-atomic-neutral-60,#8a8a8a)]'}`}>
              홈
            </span>
          )}
        </NavLink>
        <NavLink to="/rider/history" className="flex flex-col items-center justify-center flex-1 h-full no-underline">
          {({ isActive }) => (
            <span className={`text-xs ${isActive ? 'font-bold text-[var(--color-atomic-neutral-10,#171717)]' : 'text-[var(--color-atomic-neutral-60,#8a8a8a)]'}`}>
              배달내역
            </span>
          )}
        </NavLink>
        <NavLink to="/rider/earnings" className="flex flex-col items-center justify-center flex-1 h-full no-underline">
          {({ isActive }) => (
            <span className={`text-xs ${isActive ? 'font-bold text-[var(--color-atomic-neutral-10,#171717)]' : 'text-[var(--color-atomic-neutral-60,#8a8a8a)]'}`}>
              수익
            </span>
          )}
        </NavLink>
        <NavLink to="/rider/settings" className="flex flex-col items-center justify-center flex-1 h-full no-underline">
          {({ isActive }) => (
            <span className={`text-xs ${isActive ? 'font-bold text-[var(--color-atomic-neutral-10,#171717)]' : 'text-[var(--color-atomic-neutral-60,#8a8a8a)]'}`}>
              설정
            </span>
          )}
        </NavLink>
      </nav>
    </>
  );
}
