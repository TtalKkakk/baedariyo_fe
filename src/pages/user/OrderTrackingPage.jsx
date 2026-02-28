import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { getMyPayments } from '@/shared/api';
import {
  formatPaymentAmount,
  formatPaymentDateTime,
  getPaymentErrorMessage,
  getPaymentRouteId,
  getPaymentStatusClassName,
  getPaymentStatusLabel,
} from '@/shared/lib/paymentView';

const TRACKING_STEPS = [
  {
    key: 'READY',
    title: '주문 생성',
    description: '주문이 생성되어 접수 대기 중입니다.',
  },
  {
    key: 'REQUESTED',
    title: '결제 요청',
    description: '결제 요청이 전송되었습니다.',
  },
  {
    key: 'APPROVED',
    title: '결제 완료',
    description: '결제가 승인되었습니다.',
  },
];

function findPaymentByRouteId(payments, routeId) {
  if (!Array.isArray(payments) || !routeId) return null;
  return payments.find((item) => getPaymentRouteId(item) === routeId) ?? null;
}

function getCurrentStepIndex(paymentStatus) {
  const statusOrder = ['READY', 'REQUESTED', 'APPROVED'];
  return statusOrder.indexOf(paymentStatus);
}

function getStepVariant(stepIndex, currentStepIndex) {
  if (currentStepIndex === -1) return 'pending';
  if (stepIndex < currentStepIndex) return 'completed';
  if (stepIndex === currentStepIndex) return 'current';
  return 'pending';
}

function getStepClassName(variant) {
  if (variant === 'completed') {
    return 'border-[var(--color-atomic-blue-65)] bg-[var(--color-atomic-blue-95)]';
  }
  if (variant === 'current') {
    return 'border-[var(--color-atomic-redOrange-80)] bg-[var(--color-atomic-redOrange-99)]';
  }
  return 'border-[var(--color-semantic-line-normal-normal)] bg-white';
}

export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId = '' } = useParams();

  const routeId = orderId.trim();
  const searchParams = new URLSearchParams(location.search);
  const selectedStatus = searchParams.get('status') || 'ALL';
  const queryStatus = selectedStatus === 'ALL' ? undefined : selectedStatus;

  const statePayment = location.state?.payment ?? null;
  const isStatePaymentMatch =
    statePayment && getPaymentRouteId(statePayment) === routeId;
  const shouldFetch = Boolean(routeId) && !isStatePaymentMatch;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['order-tracking', routeId, queryStatus ?? 'ALL'],
    queryFn: () => getMyPayments(queryStatus),
    enabled: shouldFetch,
    retry: 1,
  });

  const payments = Array.isArray(data) ? data : [];
  const payment = isStatePaymentMatch
    ? statePayment
    : findPaymentByRouteId(payments, routeId);

  const moveToOrderList = () => {
    const nextSearch =
      selectedStatus === 'ALL' ? '' : `?status=${selectedStatus}`;
    navigate(`/orders${nextSearch}`);
  };

  const moveToOrderDetail = () => {
    if (!payment) return;
    const nextSearch =
      selectedStatus === 'ALL' ? '' : `?status=${selectedStatus}`;
    navigate(`/orders/${routeId}${nextSearch}`, {
      state: { payment, routeId },
    });
  };

  if (!routeId) {
    return (
      <div className="px-4 py-6">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          잘못된 주문 경로입니다.
        </p>
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="mt-3 h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
        >
          주문 내역으로 이동
        </button>
      </div>
    );
  }

  if (shouldFetch && isLoading) {
    return (
      <div className="px-4 py-6">
        <p className="text-body1 text-[var(--color-semantic-label-normal)]">
          주문 추적 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (shouldFetch && isError) {
    const isUnauthorized = error?.response?.status === 401;

    return (
      <div className="px-4 py-6">
        <p className="text-body1 font-semibold text-[var(--color-semantic-status-cautionary)]">
          {getPaymentErrorMessage(
            error,
            '주문 추적 정보를 불러오지 못했습니다.'
          )}
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

  if (!payment) {
    return (
      <div className="px-4 py-6">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          추적할 주문 정보를 찾을 수 없습니다.
        </p>
        <button
          type="button"
          onClick={moveToOrderList}
          className="mt-3 h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
        >
          주문 내역으로 이동
        </button>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex(payment?.paymentStatus);
  const statusClassName = getPaymentStatusClassName(payment?.paymentStatus);
  const orderMenus = Array.isArray(payment?.orderMenus)
    ? payment.orderMenus
    : [];
  const isFailedOrCanceled =
    payment?.paymentStatus === 'FAILED' ||
    payment?.paymentStatus === 'CANCELED';

  return (
    <div className="min-h-full bg-white px-4 py-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
          실시간 주문 추적
        </h1>
        <button
          type="button"
          onClick={moveToOrderDetail}
          className="h-8 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body3 font-medium text-[var(--color-semantic-label-normal)]"
        >
          상세로
        </button>
      </div>

      <section className="mt-3 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
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
        <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
          주문일시: {formatPaymentDateTime(payment?.createdAt)}
        </p>
        <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
          결제금액: {formatPaymentAmount(payment?.amount)}
        </p>
      </section>

      {isFailedOrCanceled ? (
        <section className="mt-4 rounded-xl border border-[var(--color-semantic-status-cautionary)] bg-[var(--color-atomic-redOrange-99)] p-4">
          <p className="text-body1 font-semibold text-[var(--color-semantic-status-cautionary)]">
            주문이 {payment?.paymentStatus === 'FAILED' ? '실패' : '취소'}{' '}
            상태입니다.
          </p>
          <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
            주문 내역에서 다른 주문의 진행 상태를 확인해 주세요.
          </p>
        </section>
      ) : (
        <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
          <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            진행 단계
          </h2>
          <ol className="mt-3 space-y-2">
            {TRACKING_STEPS.map((step, index) => {
              const stepVariant = getStepVariant(index, currentStepIndex);
              return (
                <li
                  key={step.key}
                  className={`rounded-lg border px-3 py-2 ${getStepClassName(stepVariant)}`}
                >
                  <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-body3 text-[var(--color-semantic-label-alternative)]">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
        <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          주문 메뉴
        </h2>
        {orderMenus.length === 0 ? (
          <p className="mt-2 text-body3 text-[var(--color-semantic-label-alternative)]">
            메뉴 정보가 없습니다.
          </p>
        ) : (
          <ul className="mt-2 space-y-1">
            {orderMenus.map((menu, index) => (
              <li
                key={`${menu?.menuName ?? 'menu'}-${index}`}
                className="flex items-center justify-between text-body3"
              >
                <span className="text-[var(--color-semantic-label-normal)]">
                  {menu?.menuName ?? '메뉴'} x{menu?.quantity ?? 0}
                </span>
                <span className="text-[var(--color-semantic-label-alternative)]">
                  {formatPaymentAmount(menu?.price)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
