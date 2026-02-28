import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAddressBookStore, useCartStore } from '@/shared/store';

const MENU_ITEMS = [
  { label: '프로필', path: '/mypage/profile' },
  { label: '주소 관리', path: '/mypage/addresses' },
  { label: '결제 관리', path: '/mypage/payment' },
  { label: '내 리뷰', path: '/mypage/reviews' },
  { label: '쿠폰', path: '/mypage/coupons' },
  { label: '보안 설정', path: '/mypage/security' },
  { label: '약관 및 정책', path: '/mypage/terms' },
  { label: '고객센터', path: '/mypage/support' },
  { label: '문의하기', path: '/mypage/inquiries' },
  { label: '알림 설정', path: '/mypage/notification-settings' },
  { label: '회원 탈퇴', path: '/mypage/withdraw' },
];

function SummaryCard({ title, value, description }) {
  return (
    <div className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-3">
      <p className="text-caption1 text-[var(--color-semantic-label-alternative)]">
        {title}
      </p>
      <p className="mt-1 text-title3 font-semibold text-[var(--color-semantic-label-normal)]">
        {value}
      </p>
      <p className="mt-1 text-caption1 text-[var(--color-semantic-label-alternative)]">
        {description}
      </p>
    </div>
  );
}

export default function MyPage() {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const addresses = useAddressBookStore((state) => state.addresses);
  const defaultAddressId = useAddressBookStore(
    (state) => state.defaultAddressId
  );

  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = Boolean(accessToken);

  const cartQuantity = useMemo(
    () =>
      cartItems.reduce((acc, item) => {
        const quantity = Number(item?.quantity) || 0;
        return acc + quantity;
      }, 0),
    [cartItems]
  );

  const defaultAddressLabel =
    addresses.find((item) => item.id === defaultAddressId)?.label ?? '-';

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="min-h-full bg-white px-4 py-4 pb-8">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        마이페이지
      </h1>
      <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
        계정/주문/주소 관련 설정을 한 곳에서 관리합니다.
      </p>

      <section className="mt-4 grid grid-cols-2 gap-2">
        <SummaryCard
          title="로그인 상태"
          value={isLoggedIn ? '인증됨' : '미인증'}
          description={
            isLoggedIn
              ? 'accessToken이 저장되어 있습니다.'
              : '로그인이 필요합니다.'
          }
        />
        <SummaryCard
          title="장바구니 수량"
          value={`${cartQuantity}개`}
          description={`메뉴 ${cartItems.length}종`}
        />
        <SummaryCard
          title="저장 주소"
          value={`${addresses.length}개`}
          description={`기본 주소: ${defaultAddressLabel}`}
        />
        <SummaryCard
          title="주문 내역"
          value="확인 가능"
          description="결제/주문 API 연동 완료"
        />
      </section>

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white">
        <ul className="divide-y divide-[var(--color-semantic-line-normal-normal)]">
          {MENU_ITEMS.map((item) => (
            <li key={item.path}>
              <button
                type="button"
                onClick={() => navigate(item.path)}
                className="w-full h-11 px-3 text-left text-body2 text-[var(--color-semantic-label-normal)]"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-4 flex gap-2">
        {!isLoggedIn ? (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex-1 h-10 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
          >
            로그인
          </button>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 h-10 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
          >
            로그아웃
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="flex-1 h-10 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body2 font-semibold"
        >
          주문 내역 보기
        </button>
      </div>
    </div>
  );
}
