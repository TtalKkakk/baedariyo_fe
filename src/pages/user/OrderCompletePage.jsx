import { useLocation, useNavigate } from 'react-router-dom';

import { BottomSheet } from '@/shared/ui';

function formatAmount(amount) {
  if (typeof amount !== 'number') return '-';
  return `${amount.toLocaleString('ko-KR')}원`;
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between py-[14px] border-b border-[var(--color-semantic-line-normal-normal)] last:border-0">
      <span className="text-[14px] text-[var(--color-semantic-label-alternative)] shrink-0 mr-4">
        {label}
      </span>
      <span className="text-[14px] text-[var(--color-semantic-label-normal)] text-right min-w-0 break-keep">
        {value}
      </span>
    </div>
  );
}

export default function OrderCompletePage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    navigate('/', { replace: true });
    return null;
  }

  const items = state?.items ?? [];
  const address = state?.address ?? '';
  const riderRequest = state?.riderRequest ?? '없음';
  const orderAmount = state?.orderAmount ?? 0;
  const deliveryFee = state?.deliveryFee ?? 0;
  const totalAmount = state?.totalAmount ?? 0;

  const menuNames = items.map((item) => item.menuName);

  return (
    <div className="-mx-4 -mt-2 -mb-2 bg-[var(--color-atomic-coolNeutral-97)] h-full flex flex-col min-h-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {/* 완료 메시지 */}
        <div className="bg-white flex flex-col items-center pt-8 pb-4">
          <div className="w-[55px] h-[55px] rounded-full bg-[#4CAF50] flex items-center justify-center mb-[26px]">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M7 16.5L13 22.5L25 10"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-[24px] font-bold text-[var(--color-semantic-label-normal)] mb-2">
            주문이 완료됐어요!
          </p>
          <p className="text-[16px] text-[var(--color-semantic-label-alternative)] text-center leading-relaxed whitespace-pre-line">
            {'가게에서 주문을 확인 중이에요.\n잠시만 기다려주세요'}
          </p>
        </div>

        {/* 두꺼운 구분선 */}
        <div className="h-3 bg-[var(--color-atomic-coolNeutral-97)]" />

        {/* 주문 상세 */}
        <div className="bg-white px-4 pt-5 pb-1">
          <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)] mb-3">
            주문 상세
          </p>
          <InfoRow
            label="주문 메뉴"
            value={
              menuNames.length > 0 ? (
                <span className="flex flex-col items-end gap-[2px]">
                  {menuNames.map((name, i) => (
                    <span key={i}>{name}</span>
                  ))}
                </span>
              ) : (
                '메뉴 정보 없음'
              )
            }
          />
          <InfoRow label="배달 주소" value={address || '주소 정보 없음'} />
          <InfoRow label="수령 방법" value="배달" />
          <InfoRow
            label="라이더 요청"
            value={riderRequest === '없음' ? '없음' : riderRequest}
          />
        </div>

        {/* 두꺼운 구분선 */}
        <div className="h-3 bg-[var(--color-atomic-coolNeutral-97)]" />

        {/* 결제 정보 */}
        <div className="bg-white px-4 pt-5 pb-5">
          <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)] mb-1">
            결제 정보
          </p>
          <div className="flex flex-col gap-[6px] mt-3">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[var(--color-semantic-label-alternative)]">
                주문 금액
              </span>
              <span className="text-[14px] text-[var(--color-semantic-label-normal)]">
                {formatAmount(orderAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-semantic-line-normal-normal)]">
              <span className="text-[14px] text-[var(--color-semantic-label-alternative)]">
                배달비
              </span>
              <span className="text-[14px] text-[var(--color-semantic-label-normal)]">
                {formatAmount(deliveryFee)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[15px] font-bold text-[var(--color-semantic-label-normal)]">
                결제금액
              </span>
              <span className="text-[18px] font-bold text-[var(--color-semantic-label-normal)]">
                {formatAmount(totalAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[var(--color-semantic-label-alternative)]">
                결제수단
              </span>
              <span className="text-[14px] text-[var(--color-semantic-label-normal)]">
                신용카드 (신한카드)
              </span>
            </div>
          </div>
        </div>

        <div className="h-[40px] bg-[var(--color-atomic-coolNeutral-97)]" />
      </div>

      {/* 하단 버튼 */}
      <BottomSheet className="py-4">
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-[160px] h-[48px] rounded-[10px] bg-[var(--color-atomic-coolNeutral-97)] text-[16px] text-[var(--color-semantic-label-normal)]"
          >
            홈으로 가기
          </button>
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="w-[160px] h-[48px] rounded-[10px] bg-[var(--color-atomic-redOrange-80)] text-white text-[16px]"
          >
            배달 현황 보기
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
