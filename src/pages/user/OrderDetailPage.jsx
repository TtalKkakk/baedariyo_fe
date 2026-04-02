import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { getMyPayments, deleteMyPayment } from '@/shared/api';
import {
  useAddressBookStore,
  useCartStore,
  useProfileStore,
} from '@/shared/store';
import { ConfirmModal } from '@/shared/ui';
import {
  formatPaymentAmount,
  getPaymentErrorMessage,
  getPaymentRouteId,
} from '@/shared/lib/paymentView';

function findPaymentByRouteId(payments, routeId) {
  return (
    (Array.isArray(payments) ? payments : []).find(
      (p) => getPaymentRouteId(p) === routeId
    ) ?? null
  );
}

function SectionDivider() {
  return <div className="h-3 bg-[var(--color-atomic-coolNeutral-97)]" />;
}

function InfoRow({ label, value }) {
  return (
    <div className="mb-4">
      <p className="text-[14px] font-bold text-[var(--color-semantic-label-normal)]">
        {label}
      </p>
      <p className="text-[14px] text-[var(--color-semantic-label-alternative)] mt-[4px]">
        {value || '-'}
      </p>
    </div>
  );
}

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId = '' } = useParams();

  const profile = useProfileStore((s) => s.profile);
  const defaultAddress = useAddressBookStore((s) =>
    s.addresses.find((a) => a.id === s.defaultAddressId)
  );
  const { clearCart, addItem } = useCartStore();
  const queryClient = useQueryClient();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const routeId = orderId.trim();
  const statePayment = location.state?.payment ?? null;
  const isMatch = statePayment && getPaymentRouteId(statePayment) === routeId;
  const shouldFetch = Boolean(routeId) && !isMatch;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['order-detail', routeId],
    queryFn: () => getMyPayments(),
    enabled: shouldFetch,
    retry: 1,
  });

  const payment = isMatch ? statePayment : findPaymentByRouteId(data, routeId);

  // ── 에러 / 로딩 / 없음 상태 ─────────────────────────────

  if (!routeId) {
    return (
      <div className="py-8 text-center">
        <p className="text-[15px] font-semibold text-[var(--color-semantic-label-normal)]">
          잘못된 주문 경로입니다.
        </p>
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="mt-4 h-10 px-5 rounded-xl border border-[var(--color-semantic-line-normal-normal)] text-[14px] text-[var(--color-semantic-label-normal)]"
        >
          주문 내역으로 이동
        </button>
      </div>
    );
  }

  if (shouldFetch && isLoading) {
    return (
      <p className="py-8 text-center text-[14px] text-[var(--color-semantic-label-alternative)]">
        불러오는 중...
      </p>
    );
  }

  if (shouldFetch && isError) {
    return (
      <div className="py-8 text-center">
        <p className="text-[14px] text-[var(--color-semantic-status-cautionary)]">
          {getPaymentErrorMessage(error, '주문 상세를 불러오지 못했습니다.')}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 h-9 px-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] text-[13px] text-[var(--color-semantic-label-normal)]"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="py-8 text-center">
        <p className="text-[15px] font-semibold text-[var(--color-semantic-label-normal)]">
          주문 정보를 찾을 수 없습니다.
        </p>
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="mt-4 h-10 px-5 rounded-xl border border-[var(--color-semantic-line-normal-normal)] text-[14px] text-[var(--color-semantic-label-normal)]"
        >
          주문 내역으로 이동
        </button>
      </div>
    );
  }

  // ── 데이터 계산 ─────────────────────────────────────────

  const orderMenus = Array.isArray(payment?.orderMenus)
    ? payment.orderMenus
    : [];
  const menuTotal = orderMenus.reduce(
    (s, m) => s + (m.price ?? 0) * (m.quantity ?? 1),
    0
  );
  const deliveryFee = Math.max(0, (payment?.amount ?? 0) - menuTotal);

  const phone = profile?.phoneNumber || '010-6659-5866';
  const addressText = defaultAddress
    ? `${defaultAddress.roadAddress}${defaultAddress.detailAddress ? ' ' + defaultAddress.detailAddress : ''}`
    : '-';

  // ── 재주문 ──────────────────────────────────────────────

  function handleReorder() {
    clearCart();
    const storePublicId = payment?.storePublicId ?? 'unknown';
    const storeName = payment?.storeName ?? '';

    orderMenus.forEach((menu) => {
      const selectedOptions = Array.isArray(menu.options)
        ? menu.options.map((opt, i) => ({
            groupId: opt.groupId ?? i,
            groupName: opt.groupName ?? '',
            optionId: opt.optionId ?? i,
            optionName: opt.optionName ?? '',
            optionPriceAmount: opt.optionPriceAmount ?? opt.price ?? 0,
          }))
        : [];

      addItem({
        storePublicId,
        storeName,
        menuId: menu.menuId ?? menu.menuPublicId ?? menu.menuName ?? 'unknown-menu',
        menuName: menu.menuName ?? '메뉴',
        menuDescription: '',
        basePriceAmount: menu.price ?? 0,
        selectedOptions,
        quantity: menu.quantity ?? 1,
        deliveryFee: deliveryFee,
        minimumOrderAmount: 0,
      });
    });

    navigate('/cart');
  }

  // ── 주문 내역 삭제 ───────────────────────────────────────

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteMyPayment(payment.paymentId);
      queryClient.invalidateQueries({ queryKey: ['my-payments'] });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      navigate('/orders', { state: { showDeleteToast: true } });
    }
  }

  // ── UI ─────────────────────────────────────────────────

  return (
    <>
      <div className="relative -mx-4 -mt-2 -mb-2 bg-white min-h-full overflow-y-auto">
        {/* ── 주문 메뉴 ── */}
        <div className="bg-white px-4 pt-5 pb-4">
          <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)] mb-4">
            주문 메뉴
          </p>

          <div className="space-y-5">
            {orderMenus.length === 0 ? (
              <p className="text-[14px] text-[var(--color-semantic-label-alternative)]">
                메뉴 정보가 없습니다.
              </p>
            ) : (
              orderMenus.map((menu, i) => (
                <div key={`${menu?.menuName}-${i}`} className="flex gap-3">
                  <img
                    src={`https://picsum.photos/seed/menu-${encodeURIComponent(menu?.menuName ?? i)}/120/120`}
                    alt={menu?.menuName}
                    className="w-[64px] h-[64px] rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold text-[var(--color-semantic-label-normal)] leading-snug">
                      {menu?.menuName ?? '메뉴'}
                    </p>
                    <p className="text-[15px] font-bold text-[var(--color-semantic-label-normal)] mt-[2px]">
                      {formatPaymentAmount(
                        (menu?.price ?? 0) * (menu?.quantity ?? 1)
                      )}
                    </p>
                    <p className="text-[13px] text-[var(--color-semantic-label-alternative)] mt-[2px]">
                      가격 : {formatPaymentAmount(menu?.price ?? 0)}
                    </p>
                    {Array.isArray(menu?.options) &&
                      menu.options.map((opt, oi) => (
                        <p
                          key={oi}
                          className="text-[13px] text-[var(--color-semantic-label-alternative)]"
                        >
                          {opt.groupName} : {opt.optionName}
                        </p>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={handleReorder}
            className="w-full h-[44px] mt-5 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white text-[15px] font-medium text-[var(--color-semantic-label-normal)]"
          >
            재주문
          </button>
        </div>

        <SectionDivider />

        {/* ── 결제 정보 ── */}
        <div className="bg-white px-4 pt-5 pb-4">
          <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)] mb-4">
            결제 정보
          </p>

          <div className="space-y-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[var(--color-semantic-label-alternative)]">
                주문 금액
              </span>
              <span className="text-[14px] text-[var(--color-semantic-label-normal)]">
                {formatPaymentAmount(menuTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[var(--color-semantic-label-alternative)]">
                배달비
              </span>
              <span className="text-[14px] text-[var(--color-semantic-label-normal)]">
                {formatPaymentAmount(deliveryFee)}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--color-semantic-line-normal-normal)]">
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-bold text-[var(--color-semantic-label-normal)]">
                결제금액
              </span>
              <span className="text-[18px] font-bold text-[var(--color-semantic-label-normal)]">
                {formatPaymentAmount(payment?.amount ?? 0)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-[6px]">
              <span className="text-[14px] text-[var(--color-semantic-label-alternative)]">
                결제수단
              </span>
              <span className="text-[14px] text-[var(--color-semantic-label-normal)]">
                신용카드 (삼성카드)
              </span>
            </div>
          </div>
        </div>

        <SectionDivider />

        {/* ── 배달 정보 ── */}
        <div className="bg-white px-4 pt-5 pb-2">
          <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)] mb-4">
            배달 정보
          </p>
          <InfoRow label="전화번호" value={phone} />
          <InfoRow label="배달 주소" value={addressText} />
          <InfoRow
            label="라이더 요청사항"
            value={payment?.riderRequest || '없음'}
          />
          <InfoRow
            label="가게 요청사항"
            value={payment?.storeRequest || '없음'}
          />
        </div>

        {/* ── 주문 내역 삭제 ── */}
        <div className="bg-white px-4 py-4">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="w-full h-[44px] rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white text-[15px] font-medium text-[var(--color-semantic-label-alternative)]"
          >
            주문 내역 삭제
          </button>
        </div>
      </div>

      {/* ── 삭제 확인 모달 (layout-frame 기준 absolute) ── */}
      {showDeleteModal &&
        createPortal(
          <ConfirmModal
            isOpen={showDeleteModal}
            title="주문 내역을 삭제할까요?"
            description="삭제한 후에는 복구할 수 없습니다."
            confirmLabel={isDeleting ? '삭제 중...' : '삭제'}
            cancelLabel="취소"
            isDestructive
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
          />,
          document.getElementById('user-layout-root') ?? document.body
        )}
    </>
  );
}
