import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { assignRiderToOrder } from '@/shared/api';

function toPositiveInteger(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '배차 요청에 실패했습니다.'
  );
}

export default function RiderHomePage() {
  const navigate = useNavigate();
  const [orderIdInput, setOrderIdInput] = useState('');
  const [assignedOrderId, setAssignedOrderId] = useState(null);

  const assignMutation = useMutation({
    mutationFn: assignRiderToOrder,
    onSuccess: (_, variables) => {
      setAssignedOrderId(variables.orderId);
    },
  });

  const onAssignOrder = (event) => {
    event.preventDefault();

    const parsedOrderId = toPositiveInteger(orderIdInput);
    if (!parsedOrderId) {
      window.alert('orderId는 1 이상의 정수여야 합니다.');
      return;
    }

    assignMutation.mutate({ orderId: parsedOrderId });
  };

  return (
    <div className="min-h-full bg-white px-4 py-6">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        배달원 홈
      </h1>
      <p className="mt-1 text-body2 text-[var(--color-semantic-label-alternative)]">
        주문 ID를 입력해 배차(할당) 요청을 보낼 수 있습니다.
      </p>

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4">
        <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          배차 요청
        </h2>

        <form onSubmit={onAssignOrder} className="mt-2 space-y-2">
          <input
            type="number"
            value={orderIdInput}
            onChange={(event) => setOrderIdInput(event.target.value)}
            placeholder="orderId"
            min={1}
            className="w-full h-10 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3 outline-none"
            required
          />
          <button
            type="submit"
            disabled={assignMutation.isPending}
            className="w-full h-10 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body2 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {assignMutation.isPending ? '요청 중...' : '배차 요청 보내기'}
          </button>
        </form>

        {assignedOrderId ? (
          <p className="mt-2 text-body3 text-[var(--color-semantic-label-normal)]">
            주문 {assignedOrderId} 배차 요청이 완료되었습니다.
          </p>
        ) : null}

        {assignMutation.isError ? (
          <div className="mt-2">
            <p className="text-body3 text-[var(--color-semantic-status-cautionary)]">
              {getErrorMessage(assignMutation.error)}
            </p>
            {assignMutation.error?.response?.status === 401 ? (
              <button
                type="button"
                onClick={() => navigate('/rider/login')}
                className="mt-2 h-8 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-caption1"
              >
                배달원 로그인으로 이동
              </button>
            ) : null}
          </div>
        ) : null}
      </section>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => navigate('/rider/history')}
          className="h-10 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3"
        >
          배달 히스토리
        </button>
        <button
          type="button"
          onClick={() => navigate('/rider/settings')}
          className="h-10 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3"
        >
          설정
        </button>
      </div>
    </div>
  );
}
