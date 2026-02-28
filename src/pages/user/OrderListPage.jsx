import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';

import { getMyPayments } from '@/shared/api';
import {
  PAYMENT_STATUS_FILTERS,
  formatPaymentAmount,
  formatPaymentDateTime,
  getPaymentErrorMessage,
  getPaymentRouteId,
  getPaymentStatusClassName,
  getPaymentStatusLabel,
} from '@/shared/lib/paymentView';

function PaymentItem({ payment, onOpenDetail }) {
  const orderMenus = Array.isArray(payment?.orderMenus)
    ? payment.orderMenus
    : [];
  const statusClassName = getPaymentStatusClassName(payment?.paymentStatus);

  return (
    <li className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          {payment?.storeName ?? '가게명 없음'}
        </p>
        <span
          className={`rounded-full px-2 py-0.5 text-caption1 ${statusClassName}`}
        >
          {getPaymentStatusLabel(payment?.paymentStatus)}
        </span>
      </div>

      <p className="mt-1 text-caption1 text-[var(--color-semantic-label-alternative)]">
        주문일시: {formatPaymentDateTime(payment?.createdAt)}
      </p>

      <div className="mt-3 space-y-1">
        {orderMenus.length === 0 ? (
          <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
            메뉴 정보가 없습니다.
          </p>
        ) : (
          orderMenus.map((menu, index) => (
            <div
              key={`${menu?.menuName ?? 'menu'}-${index}`}
              className="flex items-center justify-between text-body3"
            >
              <span className="text-[var(--color-semantic-label-normal)]">
                {menu?.menuName ?? '메뉴'} x{menu?.quantity ?? 0}
              </span>
              <span className="text-[var(--color-semantic-label-alternative)]">
                {formatPaymentAmount(menu?.price)}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-[var(--color-semantic-line-normal-normal)] flex items-center justify-between">
        <span className="text-body2 text-[var(--color-semantic-label-alternative)]">
          결제금액
        </span>
        <span className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          {formatPaymentAmount(payment?.amount)}
        </span>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => onOpenDetail(payment)}
          className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body3 font-medium text-[var(--color-semantic-label-normal)]"
        >
          상세 보기
        </button>
      </div>

      {typeof payment?.rating === 'number' || payment?.storeReviewComment ? (
        <div className="mt-3 rounded-lg bg-[var(--color-semantic-background-normal-normal)] px-3 py-2">
          <p className="text-caption1 text-[var(--color-semantic-label-alternative)]">
            리뷰 정보
          </p>
          {typeof payment?.rating === 'number' ? (
            <p className="mt-0.5 text-body3 text-[var(--color-semantic-label-normal)]">
              평점: {payment.rating}
            </p>
          ) : null}
          {payment?.storeReviewComment ? (
            <p className="mt-0.5 text-body3 text-[var(--color-semantic-label-normal)]">
              {payment.storeReviewComment}
            </p>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

export default function OrderListPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const selectedStatus = searchParams.get('status') || 'ALL';
  const queryStatus = selectedStatus === 'ALL' ? undefined : selectedStatus;

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['my-payments', queryStatus ?? 'ALL'],
    queryFn: () => getMyPayments(queryStatus),
    retry: 1,
  });

  const payments = Array.isArray(data) ? data : [];
  const selectedStatusSearch =
    selectedStatus === 'ALL' ? '' : `?status=${selectedStatus}`;

  const moveWithStatus = (status) => {
    const nextSearch = status === 'ALL' ? '' : `?status=${status}`;
    navigate(`/orders${nextSearch}`);
  };

  const openOrderDetail = (payment) => {
    if (!payment) return;

    const paymentRouteId = getPaymentRouteId(payment);
    navigate(`/orders/${paymentRouteId}${selectedStatusSearch}`, {
      state: { payment, routeId: paymentRouteId },
    });
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <p className="text-body1 text-[var(--color-semantic-label-normal)]">
          주문 내역을 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (isError) {
    const isUnauthorized = error?.response?.status === 401;

    return (
      <div className="px-4 py-6">
        <p className="text-body1 font-semibold text-[var(--color-semantic-status-cautionary)]">
          {getPaymentErrorMessage(error, '주문 내역을 불러오지 못했습니다.')}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
          >
            다시 시도
          </button>
          {isUnauthorized ? (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
            >
              로그인하러 가기
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white px-4 py-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
          주문 내역
        </h1>
        <p className="text-caption1 text-[var(--color-semantic-label-alternative)]">
          {isFetching ? '동기화 중...' : `${payments.length}건`}
        </p>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none">
        {PAYMENT_STATUS_FILTERS.map((filter) => {
          const isActive = filter.key === selectedStatus;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => moveWithStatus(filter.key)}
              className={`h-8 px-3 rounded-full border text-body3 whitespace-nowrap ${
                isActive
                  ? 'border-[var(--color-atomic-redOrange-80)] text-[var(--color-semantic-status-cautionary)] bg-[var(--color-atomic-redOrange-99)]'
                  : 'border-[var(--color-semantic-line-normal-normal)] text-[var(--color-semantic-label-alternative)] bg-white'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {payments.length === 0 ? (
        <div className="mt-10 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] p-6 text-center">
          <p className="text-body1 font-medium text-[var(--color-semantic-label-normal)]">
            주문 내역이 없습니다.
          </p>
          <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
            다른 상태 필터로도 확인해 보세요.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {payments.map((payment, index) => (
            <PaymentItem
              key={`${getPaymentRouteId(payment)}-${index}`}
              payment={payment}
              onOpenDetail={openOrderDetail}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
