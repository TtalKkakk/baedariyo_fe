import { useNavigate, useLocation, useMatch } from 'react-router-dom';

import ArrowIcon from '@/shared/assets/icons/header/arrow.svg?react';
import BackIcon from '@/shared/assets/icons/header/back.svg?react';
import CartIcon from '@/shared/assets/icons/header/cart.svg?react';
import EditIcon from '@/shared/assets/icons/header/edit.svg?react';
import LocationIcon from '@/shared/assets/icons/header/location.svg?react';
import SearchIcon from '@/shared/assets/icons/header/search.svg?react';
import { useAddressBookStore } from '@/shared/store';

const TITLE_ROUTES = {
  '/orders': '주문 내역',
  '/mypage': '마이페이지',
};

const BACK_TITLE_ROUTES = {
  '/cart': '장바구니',
  '/address/search': '주소 검색',
  '/address/setting': '주소 설정',
  '/address/location': '위치 확인',
  '/mypage/profile': '프로필 수정',
  '/mypage/addresses': '주소 관리',
  '/mypage/payment': '결제 관리',
  '/mypage/reviews': '내 리뷰',
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
  const title = TITLE_ROUTES[pathname];
  const backTitle = BACK_TITLE_ROUTES[pathname];
  const addresses = useAddressBookStore((state) => state.addresses);
  const defaultAddress = useAddressBookStore((state) =>
    state.addresses.find((a) => a.id === state.defaultAddressId)
  );

  const orderTrackingMatch = useMatch('/orders/:orderId/tracking');
  const orderDetailMatch = useMatch('/orders/:orderId');
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

  if (activeBackTitle) {
    return (
      <header className="relative flex items-center h-12 px-4 bg-white sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="shrink-0">
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
            navigate(addresses.length > 0 ? '/address/setting' : '/address/search')
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
