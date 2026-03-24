import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { getPaymentMethods, deletePaymentMethod } from '@/shared/api';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { Toast } from '@/shared/ui/Toast';

function CardIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className="text-[var(--color-semantic-label-alternative)]"
    >
      <rect
        x="8"
        y="14"
        width="32"
        height="20"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M8 21h32" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PaymentMethodCard({ method, onDelete }) {
  return (
    <div className="flex items-center py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-semantic-background-normal-alternative)]">
        <span className="text-body3 font-bold text-[var(--color-semantic-label-normal)]">
          {method.cardName?.charAt(0) ?? '?'}
        </span>
      </div>
      <div className="ml-3 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-body2 font-medium text-[var(--color-semantic-label-normal)]">
            {method.cardName}
          </span>
          {method.isDefault ? (
            <span className="rounded-full border border-[var(--color-atomic-redOrange-80)] px-2 py-0.5 text-caption2 text-[var(--color-atomic-redOrange-80)]">
              기본 설정
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-caption1 text-[var(--color-semantic-label-alternative)]">
          {method.cardNumber
            ? method.cardNumber.replace(/\d{4}(?=\d)/g, '****-').slice(0, 7)
            : '****'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onDelete(method.id)}
        className="rounded-md border border-[var(--color-semantic-line-normal-normal)] px-3 py-1.5 text-caption1 text-[var(--color-semantic-label-normal)]"
      >
        삭제
      </button>
    </div>
  );
}

export default function PaymentMethodsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: getPaymentMethods,
  });

  const methods = Array.isArray(data) ? data : [];

  const deleteMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      setDeleteTarget(null);
      setToast({ visible: true, message: '결제 수단이 삭제 되었습니다.' });
    },
  });

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-white">
        <p className="text-body2 text-[var(--color-semantic-label-alternative)]">
          불러오는 중...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white pb-4">
      {methods.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-[var(--color-semantic-line-normal-normal)] p-8">
          <div className="flex flex-col items-center gap-2">
            <CardIcon />
            <p className="text-body2 text-[var(--color-semantic-label-alternative)]">
              등록된 결제수단이 없어요
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/mypage/payment-methods/register')}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-semantic-line-normal-normal)] py-3 text-body2 text-[var(--color-semantic-label-normal)]"
          >
            <span className="text-lg">+</span>
            결제수단 추가하기
          </button>
        </div>
      ) : (
        <>
          <p className="py-3 text-body1 font-bold text-[var(--color-semantic-label-normal)]">
            등록된 카드
          </p>

          <div className="rounded-2xl border border-[var(--color-semantic-line-normal-normal)]">
            <div className="divide-y divide-[var(--color-semantic-line-normal-normal)] px-4">
              {methods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/mypage/payment-methods/register')}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-semantic-line-normal-normal)] py-3 text-body2 text-[var(--color-semantic-label-normal)]"
          >
            <span className="text-lg">+</span>
            결제수단 추가하기
          </button>
        </>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="결제수단을 삭제 하시겠어요?"
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDestructive
      />

      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast({ visible: false, message: '' })}
      />
    </div>
  );
}
