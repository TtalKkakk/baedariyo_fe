const MOCK_COUPONS = [
  {
    id: 'coupon-1',
    title: '첫 주문 3,000원 할인',
    description: '최소 주문 금액 12,000원 이상',
    discount: '3,000원',
    expireAt: '2026-05-31',
    disabled: false,
  },
  {
    id: 'coupon-2',
    title: '배달비 무료 쿠폰',
    description: '치킨/피자 카테고리 한정',
    discount: '배달비 0원',
    expireAt: '2026-04-30',
    disabled: false,
  },
  {
    id: 'coupon-3',
    title: '주말 특가 2,000원 할인',
    description: '토/일요일 주문 시 자동 적용',
    discount: '2,000원',
    expireAt: '2026-06-15',
    disabled: false,
  },
  {
    id: 'coupon-4',
    title: '신규 가입 감사 쿠폰',
    description: '가입 후 7일 이내 사용 가능',
    discount: '5,000원',
    expireAt: '2026-04-15',
    disabled: true,
  },
];

function CouponCard({ coupon }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        coupon.disabled
          ? 'border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] opacity-60'
          : 'border-[var(--color-atomic-redOrange-80)] bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            {coupon.title}
          </p>
          <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
            {coupon.description}
          </p>
          <p className="mt-2 text-caption1 text-[var(--color-semantic-label-alternative)]">
            ~ {coupon.expireAt} 까지
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-title3 font-bold text-[var(--color-atomic-redOrange-80)]">
            {coupon.discount}
          </p>
          {coupon.disabled ? (
            <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-caption1 bg-[var(--color-semantic-line-normal-normal)] text-[var(--color-semantic-label-alternative)]">
              사용 불가
            </span>
          ) : (
            <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-caption1 bg-[var(--color-atomic-redOrange-95)] text-[var(--color-atomic-redOrange-80)]">
              사용 가능
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CouponsPage() {
  const available = MOCK_COUPONS.filter((c) => !c.disabled).length;

  return (
    <div className="min-h-full bg-white py-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
          쿠폰함
        </h1>
        <p className="text-caption1 text-[var(--color-semantic-label-alternative)]">
          사용 가능 {available}개
        </p>
      </div>

      <ul className="mt-4 space-y-3">
        {MOCK_COUPONS.map((coupon) => (
          <li key={coupon.id}>
            <CouponCard coupon={coupon} />
          </li>
        ))}
      </ul>
    </div>
  );
}
