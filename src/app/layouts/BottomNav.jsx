import { Link, useLocation } from 'react-router-dom';

import HomeIcon from '@/shared/assets/icons/nav/home.svg?react';
import OrderListIcon from '@/shared/assets/icons/nav/orderList.svg?react';
import MyPageIcon from '@/shared/assets/icons/nav/mypage.svg?react';

const NAV_ITEMS = [
  { to: '/', label: '홈', Icon: HomeIcon },
  { to: '/orders', label: '주문 내역', Icon: OrderListIcon },
  { to: '/mypage', label: '마이페이지', Icon: MyPageIcon },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="flex items-center h-16 bg-surface border-t border-divider">
      {NAV_ITEMS.map(({ to, label, Icon }) => {
        const isActive =
          to === '/' ? pathname === '/' : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-1 flex-col items-center gap-1 ${isActive ? 'nav-active' : 'nav-inactive'}`}
          >
            <Icon />
            <span className="text-[11px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
