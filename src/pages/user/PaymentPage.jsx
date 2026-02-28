import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  approvePayment,
  cancelPayment,
  createPayment,
  failPayment,
  getMyPayments,
  getPaymentDetail,
} from '@/shared/api';
import {
  PAYMENT_STATUS_FILTERS,
  formatPaymentAmount,
  formatPaymentDateTime,
  getPaymentErrorMessage,
  getPaymentStatusClassName,
  getPaymentStatusLabel,
} from '@/shared/lib/paymentView';

function toPositiveInteger(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

function PaymentSummaryItem({ payment }) {
  const statusClassName = getPaymentStatusClassName(payment?.paymentStatus);

  return (
    <li className="rounded-lg border border-[var(--color-semantic-line-normal-normal)] p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
          {payment?.storeName ?? '가게명 없음'}
        </p>
        <span
          className={`rounded-full px-2 py-0.5 text-caption1 ${statusClassName}`}
        >
          {getPaymentStatusLabel(payment?.paymentStatus)}
        </span>
      </div>
      <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
        결제금액: {formatPaymentAmount(payment?.amount)}
      </p>
      <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
        생성일시: {formatPaymentDateTime(payment?.createdAt)}
      </p>
    </li>
  );
}

export default function PaymentPage() {
  const navigate = useNavigate();

  const [orderIdInput, setOrderIdInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [paymentKeyInput, setPaymentKeyInput] = useState('');
  const [paymentIdInput, setPaymentIdInput] = useState('');
  const [transactionIdInput, setTransactionIdInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [detailResult, setDetailResult] = useState(null);
  const [lastCreatedPaymentId, setLastCreatedPaymentId] = useState(null);

  const queryStatus = statusFilter === 'ALL' ? undefined : statusFilter;

  const {
    data: paymentsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['payment-page-my-payments', queryStatus ?? 'ALL'],
    queryFn: () => getMyPayments(queryStatus),
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: (result) => {
      const createdId = toPositiveInteger(result);
      setLastCreatedPaymentId(createdId);
      if (createdId) {
        setPaymentIdInput(String(createdId));
      }
      refetch();
    },
  });

  const detailMutation = useMutation({
    mutationFn: getPaymentDetail,
    onSuccess: (result) => {
      setDetailResult(result);
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ paymentId, transactionId }) =>
      approvePayment(paymentId, { transactionId }),
    onSuccess: (_, variables) => {
      detailMutation.mutate(variables.paymentId);
      refetch();
    },
  });

  const failMutation = useMutation({
    mutationFn: failPayment,
    onSuccess: (_, paymentId) => {
      detailMutation.mutate(paymentId);
      refetch();
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelPayment,
    onSuccess: (_, paymentId) => {
      detailMutation.mutate(paymentId);
      refetch();
    },
  });

  const onCreatePayment = (event) => {
    event.preventDefault();

    const parsedOrderId = toPositiveInteger(orderIdInput);
    const parsedAmount = toPositiveInteger(amountInput);
    const trimmedPaymentKey = paymentKeyInput.trim();

    if (!parsedOrderId) {
      window.alert('orderId는 1 이상의 정수여야 합니다.');
      return;
    }
    if (!parsedAmount) {
      window.alert('amount는 1 이상의 정수여야 합니다.');
      return;
    }
    if (!trimmedPaymentKey) {
      window.alert('paymentKey를 입력해 주세요.');
      return;
    }

    createMutation.mutate({
      orderId: parsedOrderId,
      amount: parsedAmount,
      paymentKey: trimmedPaymentKey,
    });
  };

  const onLoadDetail = () => {
    const parsedPaymentId = toPositiveInteger(paymentIdInput);
    if (!parsedPaymentId) {
      window.alert('paymentId는 1 이상의 정수여야 합니다.');
      return;
    }
    detailMutation.mutate(parsedPaymentId);
  };

  const onApprove = () => {
    const parsedPaymentId = toPositiveInteger(paymentIdInput);
    const trimmedTransactionId = transactionIdInput.trim();

    if (!parsedPaymentId) {
      window.alert('paymentId는 1 이상의 정수여야 합니다.');
      return;
    }
    if (!trimmedTransactionId) {
      window.alert('transactionId를 입력해 주세요.');
      return;
    }

    approveMutation.mutate({
      paymentId: parsedPaymentId,
      transactionId: trimmedTransactionId,
    });
  };

  const onFail = () => {
    const parsedPaymentId = toPositiveInteger(paymentIdInput);
    if (!parsedPaymentId) {
      window.alert('paymentId는 1 이상의 정수여야 합니다.');
      return;
    }
    failMutation.mutate(parsedPaymentId);
  };

  const onCancel = () => {
    const parsedPaymentId = toPositiveInteger(paymentIdInput);
    if (!parsedPaymentId) {
      window.alert('paymentId는 1 이상의 정수여야 합니다.');
      return;
    }
    cancelMutation.mutate(parsedPaymentId);
  };

  const payments = Array.isArray(paymentsData) ? paymentsData : [];
  const latestError =
    createMutation.error ??
    detailMutation.error ??
    approveMutation.error ??
    failMutation.error ??
    cancelMutation.error ??
    (isError ? error : null);

  const detailStatusClassName = getPaymentStatusClassName(detailResult?.status);

  return (
    <div className="min-h-full bg-white px-4 py-4 pb-8">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        결제 관리
      </h1>
      <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
        결제 생성/승인/실패/취소/조회 API를 직접 확인할 수 있습니다.
      </p>

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4">
        <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          결제 생성
        </h2>

        <form onSubmit={onCreatePayment} className="mt-2 space-y-2">
          <input
            type="number"
            value={orderIdInput}
            onChange={(event) => setOrderIdInput(event.target.value)}
            placeholder="orderId"
            min={1}
            className="w-full h-10 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3 outline-none"
            required
          />
          <input
            type="number"
            value={amountInput}
            onChange={(event) => setAmountInput(event.target.value)}
            placeholder="amount"
            min={1}
            className="w-full h-10 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3 outline-none"
            required
          />
          <input
            type="text"
            value={paymentKeyInput}
            onChange={(event) => setPaymentKeyInput(event.target.value)}
            placeholder="paymentKey"
            className="w-full h-10 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3 outline-none"
            required
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full h-10 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body2 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? '생성 중...' : '결제 생성'}
          </button>
        </form>

        {lastCreatedPaymentId ? (
          <p className="mt-2 text-body3 text-[var(--color-semantic-label-normal)]">
            생성된 paymentId: {lastCreatedPaymentId}
          </p>
        ) : null}
      </section>

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4">
        <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          결제 상태 제어
        </h2>

        <div className="mt-2 space-y-2">
          <input
            type="number"
            value={paymentIdInput}
            onChange={(event) => setPaymentIdInput(event.target.value)}
            placeholder="paymentId"
            min={1}
            className="w-full h-10 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3 outline-none"
          />
          <input
            type="text"
            value={transactionIdInput}
            onChange={(event) => setTransactionIdInput(event.target.value)}
            placeholder="transactionId (승인 시 필요)"
            className="w-full h-10 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3 outline-none"
          />
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onLoadDetail}
            disabled={detailMutation.isPending}
            className="h-10 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {detailMutation.isPending ? '조회 중...' : '상세 조회'}
          </button>
          <button
            type="button"
            onClick={onApprove}
            disabled={approveMutation.isPending}
            className="h-10 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {approveMutation.isPending ? '승인 중...' : '승인'}
          </button>
          <button
            type="button"
            onClick={onFail}
            disabled={failMutation.isPending}
            className="h-10 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {failMutation.isPending ? '실패 처리 중...' : '실패 처리'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={cancelMutation.isPending}
            className="h-10 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {cancelMutation.isPending ? '취소 처리 중...' : '취소 처리'}
          </button>
        </div>
      </section>

      {detailResult ? (
        <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
              결제 상세
            </h2>
            <span
              className={`rounded-full px-2 py-0.5 text-caption1 ${detailStatusClassName}`}
            >
              {getPaymentStatusLabel(detailResult?.status)}
            </span>
          </div>

          <div className="mt-2 space-y-1 text-body3 text-[var(--color-semantic-label-alternative)]">
            <p>paymentId: {detailResult?.paymentId ?? '-'}</p>
            <p>orderId: {detailResult?.orderId ?? '-'}</p>
            <p>userId: {detailResult?.userId ?? '-'}</p>
            <p>amount: {formatPaymentAmount(detailResult?.amount)}</p>
            <p>paymentKey: {detailResult?.paymentKey ?? '-'}</p>
            <p>createdAt: {formatPaymentDateTime(detailResult?.createdAt)}</p>
          </div>
        </section>
      ) : null}

      {latestError ? (
        <p className="mt-3 text-body3 text-[var(--color-semantic-status-cautionary)]">
          {getPaymentErrorMessage(latestError, '결제 API 요청에 실패했습니다.')}
        </p>
      ) : null}

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            내 결제 목록
          </h2>
          <p className="text-caption1 text-[var(--color-semantic-label-alternative)]">
            {isFetching ? '동기화 중...' : `${payments.length}건`}
          </p>
        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-none">
          {PAYMENT_STATUS_FILTERS.map((filter) => {
            const isActive = filter.key === statusFilter;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setStatusFilter(filter.key)}
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

        {isLoading ? (
          <p className="mt-3 text-body3 text-[var(--color-semantic-label-normal)]">
            결제 목록을 불러오는 중입니다...
          </p>
        ) : isError ? (
          <div className="mt-3">
            <p className="text-body3 text-[var(--color-semantic-status-cautionary)]">
              {getPaymentErrorMessage(
                error,
                '결제 목록을 불러오지 못했습니다.'
              )}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => refetch()}
                className="h-8 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-caption1"
              >
                다시 시도
              </button>
              {error?.response?.status === 401 ? (
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="h-8 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-caption1"
                >
                  로그인하러 가기
                </button>
              ) : null}
            </div>
          </div>
        ) : payments.length === 0 ? (
          <p className="mt-3 text-body3 text-[var(--color-semantic-label-alternative)]">
            조회된 결제 내역이 없습니다.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {payments.map((payment, index) => (
              <PaymentSummaryItem
                key={`${payment?.createdAt ?? 'payment'}-${index}`}
                payment={payment}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
