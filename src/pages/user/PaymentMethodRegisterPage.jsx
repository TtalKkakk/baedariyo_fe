import { useMutation } from '@tanstack/react-query';

import { startCardRegistration } from '@/shared/api';

const PG_URL = import.meta.env.VITE_PG_URL ?? 'http://localhost:4000';

export default function PaymentMethodRegisterPage() {
  const mutation = useMutation({
    mutationFn: startCardRegistration,
    onSuccess: ({ token }) => {
      window.location.href = `${PG_URL}?token=${token}`;
    },
  });

  return (
    <div className="flex min-h-full flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
        <p className="text-center text-body1 text-[var(--color-semantic-label-normal)]">
          카드 등록을 진행하면 카드사 선택 페이지로 이동합니다.
        </p>
        {mutation.isError && (
          <p className="text-caption1 text-[var(--color-semantic-status-negative)]">
            카드 등록을 시작할 수 없습니다. 다시 시도해주세요.
          </p>
        )}
      </div>

      <div className="p-4">
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="w-full rounded-xl bg-[var(--color-atomic-redOrange-80)] py-3.5 text-body1 font-semibold text-white disabled:bg-[var(--color-semantic-background-normal-alternative)] disabled:text-[var(--color-semantic-label-alternative)]"
        >
          {mutation.isPending ? '처리 중...' : '카드 등록'}
        </button>
      </div>
    </div>
  );
}
