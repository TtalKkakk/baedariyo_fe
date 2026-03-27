import { useRef, useState } from 'react';
import { useNavigate, useLocation, useMatch } from 'react-router-dom';

import ArrowIcon from '@/shared/assets/icons/header/arrow.svg?react';
import BackIcon from '@/shared/assets/icons/header/back.svg?react';
import CartIcon from '@/shared/assets/icons/header/cart.svg?react';
import EditIcon from '@/shared/assets/icons/header/edit.svg?react';
import LocationIcon from '@/shared/assets/icons/header/location.svg?react';
import SearchIcon from '@/shared/assets/icons/header/search.svg?react';
import XCircleIcon from '@/shared/assets/icons/header/x-circle.svg?react';
import { useAddressBookStore } from '@/shared/store';

const TITLE_ROUTES = {
  '/orders': '주문 내역',
  '/mypage': '마이페이지',
};

const BACK_TITLE_ROUTES = {
  '/cart': '장바구니',
  '/checkout': '주문하기',
  '/address/search': '주소 검색',
  '/address/setting': '주소 설정',
  '/address/location': '위치 확인',
  '/mypage/profile': '프로필 편집',
  '/mypage/addresses': '주소 관리',
  '/mypage/payment': '결제 관리',
  '/mypage/payment-methods': '결제 수단 관리',
  '/mypage/payment-methods/register': '결제 수단 등록',
  '/mypage/reviews': '내가 쓴 리뷰',
  '/mypage/coupons': '쿠폰',
  '/mypage/terms': '약관 및 정책',
  '/mypage/support': '고객센터',
  '/mypage/inquiries': '문의하기',
  '/mypage/security': '보안 설정',
  '/mypage/notification-settings': '알림 설정',
  '/mypage/withdraw': '회원 탈퇴',
};

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchInput, setSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const categoryMatch = useMatch('/category/:categoryId');
  const title = TITLE_ROUTES[pathname];
  const backTitle = BACK_TITLE_ROUTES[pathname];
  const addresses = useAddressBookStore((state) => state.addresses);
  const defaultAddress = useAddressBookStore((state) =>
    state.addresses.find((a) => a.id === state.defaultAddressId)
  );

  const orderTrackingMatch = useMatch('/orders/:orderId/tracking');
  const orderDetailMatch = useMatch('/orders/:orderId');
  const menuDetailMatch = useMatch('/stores/:storeId/menu/:menuId');
  const storeDetailMatch = useMatch('/stores/:storeId');
  const storeReviewsMatch = useMatch('/stores/:storeId/reviews');
  const storeInfoMatch = useMatch('/stores/:storeId/info');
  const dynamicBackTitle = orderTrackingMatch
    ? '실시간 주문 추적'
    : orderDetailMatch
      ? '주문 상세'
      : storeDetailMatch
        ? '가게 상세'
        : storeReviewsMatch
          ? '리뷰'
          : storeInfoMatch
            ? '가게 정보'
            : null;

  const activeBackTitle = backTitle || dynamicBackTitle;

  if (menuDetailMatch || storeDetailMatch) return null;

  if (categoryMatch) {
    return (
      <header className="flex items-center gap-3 h-14 px-4 bg-white sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="shrink-0">
          <BackIcon className="size-5" />
        </button>
        <div
          className={`flex-1 h-10 flex items-center gap-2 px-3 bg-[var(--color-semantic-background-normal-normal)] border rounded-lg transition-colors ${
            isSearchFocused
              ? 'border-[var(--color-atomic-redOrange-90)]'
              : 'border-[var(--color-semantic-line-normal-normal)]'
          }`}
        >
          <SearchIcon className="size-5 shrink-0 [&_path]:fill-[var(--color-atomic-redOrange-80)]" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchInput.trim()) {
                navigate(
                  `/search/result?q=${encodeURIComponent(searchInput.trim())}`
                );
              }
            }}
            placeholder="퇴근 하고 나서 치킨에 맥주?"
            className="flex-1 bg-transparent text-body1 font-normal text-[var(--color-semantic-label-normal)] placeholder:text-[var(--color-semantic-label-alternative)] outline-none"
          />
          {searchInput && (
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setSearchInput('')}
              className="shrink-0"
            >
              <XCircleIcon className="size-5" />
            </button>
          )}
        </div>
        <button onClick={() => navigate('/cart')} className="shrink-0">
          <CartIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-neutral)]" />
        </button>
      </header>
    );
  }

  if (activeBackTitle) {
    return (
      <header className="relative flex items-center h-12 px-4 bg-white sticky top-0 z-10">
        <button
          onClick={() =>
            pathname === '/mypage/addresses'
              ? navigate('/address/setting')
              : pathname === '/address/setting'
                ? navigate('/')
                : navigate(-1)
          }
          className="shrink-0"
        >
          <BackIcon className="size-5" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 text-[18px] font-medium text-[var(--color-semantic-label-normal)]">
          {activeBackTitle}
        </span>
        {pathname === '/address/setting' ? (
          <button
            onClick={() => navigate('/mypage/addresses')}
            className="ml-auto"
          >
            <EditIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-normal)]" />
          </button>
        ) : null}
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between h-12 px-4 bg-white sticky top-0 z-10">
      {title ? (
        <span className="text-[20px] font-bold text-[var(--color-semantic-static-black)]">
          {title}
        </span>
      ) : (
        <button
          className="flex items-center pl-1"
          onClick={() =>
            navigate(
              addresses.length > 0 ? '/address/setting' : '/address/search'
            )
          }
        >
          <LocationIcon />
          <span className="text-[20px] font-bold text-[var(--color-semantic-static-black)] ml-[10px] mr-[6px]">
            {defaultAddress ? defaultAddress.label : '주소지'}
          </span>
          <ArrowIcon className="size-4 [&_path]:fill-[var(--color-semantic-label-normal)]" />
        </button>
      )}
      <div className="flex items-center gap-5">
        <button onClick={() => navigate('/search')}>
          <SearchIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-normal)]" />
        </button>
        <button onClick={() => navigate('/cart')} className="pr-[6px]">
          <CartIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-normal)]" />
        </button>
      </div>
    </header>
  );
}
