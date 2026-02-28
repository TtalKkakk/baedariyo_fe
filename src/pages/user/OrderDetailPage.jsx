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

function findPaymentByRouteId(payments, routeId) {
  if (!Array.isArray(payments) || !routeId) return null;

  return payments.find((item) => getPaymentRouteId(item) === routeId) ?? null;
}

export default function OrderDetailPage() {
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
    queryKey: ['order-detail', routeId, queryStatus ?? 'ALL'],
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

  const moveToTracking = () => {
    if (!payment) return;

    const nextSearch =
      selectedStatus === 'ALL' ? '' : `?status=${selectedStatus}`;
    navigate(`/orders/${routeId}/tracking${nextSearch}`, {
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
          주문 상세를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (shouldFetch && isError) {
    const isUnauthorized = error?.response?.status === 401;

    return (
      <div className="px-4 py-6">
        <p className="text-body1 font-semibold text-[var(--color-semantic-status-cautionary)]">
          {getPaymentErrorMessage(error, '주문 상세를 불러오지 못했습니다.')}
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
          주문 정보를 찾을 수 없습니다.
        </p>
        <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
          목록에서 다시 선택해 주세요.
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

  const orderMenus = Array.isArray(payment?.orderMenus)
    ? payment.orderMenus
    : [];
  const storeImages = Array.isArray(payment?.storeImages)
    ? payment.storeImages
    : [];
  const statusClassName = getPaymentStatusClassName(payment?.paymentStatus);

  return (
    <div className="min-h-full bg-white px-4 py-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
          주문 상세
        </h1>
        <button
          type="button"
          onClick={moveToOrderList}
          className="h-8 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body3 font-medium text-[var(--color-semantic-label-normal)]"
        >
          목록으로
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
      </section>

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
        <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          주문 메뉴
        </h2>
        {orderMenus.length === 0 ? (
          <p className="mt-2 text-body3 text-[var(--color-semantic-label-alternative)]">
            메뉴 정보가 없습니다.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
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

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="text-body2 text-[var(--color-semantic-label-alternative)]">
            결제금액
          </span>
          <span className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            {formatPaymentAmount(payment?.amount)}
          </span>
        </div>
      </section>

      {typeof payment?.rating === 'number' || payment?.storeReviewComment ? (
        <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
          <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            리뷰 정보
          </h2>
          {typeof payment?.rating === 'number' ? (
            <p className="mt-2 text-body3 text-[var(--color-semantic-label-normal)]">
              평점: {payment.rating}
            </p>
          ) : null}
          {payment?.storeReviewComment ? (
            <p className="mt-1 text-body3 text-[var(--color-semantic-label-normal)]">
              {payment.storeReviewComment}
            </p>
          ) : null}
        </section>
      ) : null}

      {storeImages.length > 0 ? (
        <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
          <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            가게 이미지
          </h2>
          <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-none">
            {storeImages.map((imageUrl, index) => (
              <img
                key={`${imageUrl}-${index}`}
                src={imageUrl}
                alt="가게 이미지"
                className="w-24 h-24 rounded-lg object-cover shrink-0 border border-[var(--color-semantic-line-normal-normal)]"
              />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-4">
        <button
          type="button"
          onClick={moveToTracking}
          className="w-full h-10 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body2 font-semibold"
        >
          주문 추적 보기
        </button>
      </div>
    </div>
  );
}
