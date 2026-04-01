import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getMyPayments } from '@/shared/api';
import {
  DELIVERY_STATUSES,
  DELIVERY_STATUS_LABELS,
  useActiveOrderStore,
} from '@/shared/store';
import {
  formatPaymentAmount,
  getPaymentRouteId,
} from '@/shared/lib/paymentView';
import { BottomModal, Toast } from '@/shared/ui';
import ArrowIcon from '@/shared/assets/icons/header/arrow.svg?react';
import CheckIcon from '@/shared/assets/icons/header/check.svg?react';
import SearchIcon from '@/shared/assets/icons/header/search.svg?react';
import OrderIcon from '@/shared/assets/icons/order-status/order.svg?react';
import RiderIcon from '@/shared/assets/icons/order-status/rider.svg?react';

const PERIOD_OPTIONS = [
  { label: '전체', months: null },
  { label: '1개월', months: 1 },
  { label: '3개월', months: 3 },
  { label: '6개월', months: 6 },
  { label: '1년', months: 12 },
];

function formatDateOnly(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

const STATUS_ICONS = {
  CONFIRMED: OrderIcon,
  PREPARING: OrderIcon,
  DELIVERING: RiderIcon,
  DELIVERED: RiderIcon,
};

function ActiveOrderCard({ order }) {
  const navigate = useNavigate();
  const stepIndex = DELIVERY_STATUSES.indexOf(order.deliveryStatus);
  const progressPercent = stepIndex === 0 ? 8 : (stepIndex / (DELIVERY_STATUSES.length - 1)) * 100;

  const storeImage = order.storeImage
    ?? `https://picsum.photos/seed/active-${order.paymentId}/120/120`;

  const StatusIcon = STATUS_ICONS[order.deliveryStatus] ?? OrderIcon;
  const isDelivered = order.deliveryStatus === 'DELIVERED';

  return (
    <div className="rounded-2xl border-2 border-[var(--color-atomic-redOrange-80)] bg-[#fff8f5] p-3">
      {/* 상태 헤더 */}
      <div className="flex items-center justify-between mb-[10px]">
        <div className="flex items-center gap-[8px] text-[var(--color-atomic-redOrange-80)]">
          <StatusIcon />
          <p className="text-[18px] font-bold text-[var(--color-atomic-redOrange-80)]">
            {DELIVERY_STATUS_LABELS[order.deliveryStatus]}
          </p>
        </div>
        {!isDelivered && (
          <button
            type="button"
            onClick={() =>
              navigate(`/orders/${order.paymentId}/tracking`, {
                state: { payment: order },
              })
            }
            className="h-8 px-4 rounded-full bg-[var(--color-atomic-redOrange-80)] text-white text-[13px] font-medium shrink-0"
          >
            현황 보기
          </button>
        )}
      </div>

      {/* 진행 바 */}
      <div className="h-[5px] bg-[var(--color-semantic-line-normal-normal)] rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-[var(--color-atomic-redOrange-80)] rounded-full transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 가게 정보 */}
      <div className="flex items-center gap-3">
        <img
          src={storeImage}
          alt={order.storeName}
          className="w-[60px] h-[60px] rounded-xl object-cover shrink-0"
        />
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-[var(--color-semantic-label-normal)] truncate">
            {order.storeName}
          </p>
          <p className="text-[13px] text-[var(--color-semantic-label-alternative)] mt-[4px]">
            {formatDateOnly(order.createdAt)}
            <span className="mx-[6px]">|</span>
            {formatPaymentAmount(order.amount)}
          </p>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ payment, onOpenDetail }) {
  const navigate = useNavigate();
  const orderMenus = Array.isArray(payment?.orderMenus)
    ? payment.orderMenus
    : [];
  const storeImage = Array.isArray(payment?.storeImages)
    ? payment.storeImages[0]
    : null;

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-semantic-line-normal-normal)] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-3">
      {/* 가게 정보 헤더 */}
      <div className="flex items-start gap-[10px]">
        <img
          src={
            storeImage ??
            `https://picsum.photos/seed/store-${payment?.orderId}/120/120`
          }
          alt={payment?.storeName}
          className="w-[46px] h-[46px] rounded-xl object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[14px] font-bold text-[var(--color-semantic-label-normal)] truncate">
              {payment?.storeName ?? '가게명 없음'}
            </p>
            <button
              type="button"
              onClick={() => onOpenDetail(payment)}
              className="shrink-0 py-1 px-2 rounded-full border border-[var(--color-semantic-line-normal-normal)] bg-white text-[12px] text-[var(--color-semantic-label-normal)]"
            >
              주문 상세
            </button>
          </div>
          <p className="text-[12px] font-medium text-[var(--color-semantic-label-alternative)] mt-[4px]">
            {formatDateOnly(payment?.createdAt)}
            <span className="mx-[6px]">|</span>
            {formatPaymentAmount(payment?.amount)}
          </p>
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div className="mt-[10px] space-y-3">
        {orderMenus.length === 0 ? (
          <p className="text-[13px] text-[var(--color-semantic-label-alternative)]">
            메뉴 정보가 없습니다.
          </p>
        ) : (
          orderMenus.map((menu, index) => (
            <div key={`${menu?.menuName ?? 'menu'}-${index}`}>
              <p className="text-[14px] text-[var(--color-semantic-label-normal)]">
                {menu?.menuName ?? '메뉴'}
              </p>
              <p className="text-[13px] text-[var(--color-semantic-label-alternative)] mt-[4px]">
                가격 : {formatPaymentAmount(menu?.price)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => onOpenDetail(payment)}
          className="w-[145px] h-[32px] rounded-[6px] border border-[var(--color-semantic-line-normal-normal)] bg-white text-[14px] font-medium text-[var(--color-semantic-label-normal)]"
        >
          리뷰 작성
        </button>
        <button
          type="button"
          onClick={() => navigate(`/stores/${payment?.storePublicId ?? ''}`)}
          className="w-[145px] h-[32px] rounded-[6px] bg-[var(--color-atomic-redOrange-80)] text-white text-[14px] font-medium"
        >
          재주문
        </button>
      </div>
    </div>
  );
}

export default function OrderListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(PERIOD_OPTIONS[0]);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  const activeOrders = useActiveOrderStore((state) => state.activeOrders);

  useEffect(() => {
    if (location.state?.showDeleteToast) {
      setShowDeleteToast(true);
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['my-payments', 'ALL'],
    queryFn: () => getMyPayments(),
    retry: 1,
  });

  const payments = Array.isArray(data) ? data : [];

  const periodFilteredPayments = selectedPeriod.months
    ? payments.filter((payment) => {
        if (!payment?.createdAt) return false;
        const created = new Date(payment.createdAt);
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - selectedPeriod.months);
        return created >= cutoff;
      })
    : payments;

  const filteredPayments = searchQuery.trim()
    ? periodFilteredPayments.filter((payment) => {
        const q = searchQuery.trim().toLowerCase();
        const storeMatch = (payment?.storeName ?? '').toLowerCase().includes(q);
        const menuMatch = (
          Array.isArray(payment?.orderMenus) ? payment.orderMenus : []
        ).some((menu) => (menu?.menuName ?? '').toLowerCase().includes(q));
        return storeMatch || menuMatch;
      })
    : periodFilteredPayments;

  const openOrderDetail = (payment) => {
    if (!payment) return;
    const paymentRouteId = getPaymentRouteId(payment);
    navigate(`/orders/${paymentRouteId}`, {
      state: { payment, routeId: paymentRouteId },
    });
  };

  return (
    <div className="min-h-full bg-white">
      {/* 검색바 */}
      <div className="bg-white px-4 pt-2 pb-0 -mx-4 -mt-2">
        <div className="flex items-center gap-3 h-[40px] px-3 bg-white border border-[var(--color-semantic-line-normal-normal)] rounded-[8px]">
          <SearchIcon className="size-[24px] shrink-0 [&_path]:fill-[var(--color-atomic-redOrange-80)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="주문했던 메뉴나 가게를 검색해보세요"
            className="flex-1 bg-transparent text-[15px] text-[var(--color-semantic-label-normal)] placeholder:text-[var(--color-semantic-label-alternative)] outline-none"
          />
        </div>

        {/* 필터 */}
        <div className="flex mt-3">
          <button
            type="button"
            onClick={() => setIsPeriodModalOpen(true)}
            className="flex items-center gap-1 h-8 px-3 rounded-full border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-atomic-coolNeutral-98)] text-[13px] text-[var(--color-semantic-label-normal)]"
          >
            {selectedPeriod.label === '전체'
              ? '조회 기간'
              : selectedPeriod.label}
            <ArrowIcon className="size-3 [&_path]:fill-[var(--color-semantic-label-normal)]" />
          </button>
        </div>
      </div>

      {/* 주문 목록 */}
      <div className="pt-4 pb-3 space-y-4">
        {/* 진행 중인 주문 (실시간) */}
        {activeOrders.map((order) => (
          <ActiveOrderCard key={order.paymentId} order={order} />
        ))}

        {isLoading && (
          <p className="text-[14px] text-[var(--color-semantic-label-alternative)] py-6 text-center">
            주문 내역을 불러오는 중입니다...
          </p>
        )}

        {isError && (
          <div className="py-6 text-center">
            <p className="text-[14px] text-[var(--color-semantic-status-negative)]">
              주문 내역을 불러오지 못했습니다.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 h-9 px-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] text-[13px] text-[var(--color-semantic-label-normal)]"
            >
              다시 시도
            </button>
            {error?.response?.status === 401 && (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="mt-2 ml-2 h-9 px-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] text-[13px] text-[var(--color-semantic-label-normal)]"
              >
                로그인하러 가기
              </button>
            )}
          </div>
        )}

        {!isLoading && !isError && filteredPayments.length === 0 && activeOrders.length === 0 && (
          <p className="text-[14px] text-[var(--color-semantic-label-alternative)] py-10 text-center">
            {searchQuery.trim()
              ? '검색 결과가 없습니다.'
              : '주문 내역이 없습니다.'}
          </p>
        )}

        {filteredPayments.map((payment, index) => (
          <OrderCard
            key={`${getPaymentRouteId(payment)}-${index}`}
            payment={payment}
            onOpenDetail={openOrderDetail}
          />
        ))}
      </div>

      <BottomModal
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
        title="조회 기간"
        showClose={false}
      >
        <div className="px-5 pb-2">
          {PERIOD_OPTIONS.map((option) => {
            const isSelected = selectedPeriod.label === option.label;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  setSelectedPeriod(option);
                  setIsPeriodModalOpen(false);
                }}
                className={`w-full flex items-center justify-between py-[10px] ${
                  isSelected
                    ? 'text-[var(--color-atomic-redOrange-80)]'
                    : 'text-[var(--color-semantic-label-normal)]'
                }`}
              >
                <span
                  className={`text-[14px] ${isSelected ? 'font-bold' : 'font-normal'}`}
                >
                  {option.label}
                </span>
                {isSelected && (
                  <CheckIcon className="size-[18px] shrink-0 [&_path]:fill-[var(--color-atomic-redOrange-80)]" />
                )}
              </button>
            );
          })}
        </div>
      </BottomModal>

      <Toast
        message="주문내역이 삭제되었습니다."
        isVisible={showDeleteToast}
        onClose={() => setShowDeleteToast(false)}
      />
    </div>
  );
}
