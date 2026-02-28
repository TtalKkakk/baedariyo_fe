import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { withdrawUser } from '@/shared/api';

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '회원 탈퇴 요청에 실패했습니다.'
  );
}

export default function WithdrawPage() {
  const navigate = useNavigate();

  const withdrawMutation = useMutation({
    mutationFn: withdrawUser,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  });

  const handleWithdraw = () => {
    const isConfirmed = window.confirm(
      '정말 탈퇴하시겠습니까? 탈퇴 후에는 계정을 복구할 수 없습니다.'
    );
    if (!isConfirmed) return;
    withdrawMutation.mutate();
  };

  return (
    <div className="min-h-full bg-white px-4 py-6">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        회원 탈퇴
      </h1>
      <p className="mt-2 text-body3 text-[var(--color-semantic-label-alternative)]">
        탈퇴 시 계정 접근이 중단됩니다. 진행 전 중요한 정보를 확인해 주세요.
      </p>

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] p-4">
        <p className="text-body2 text-[var(--color-semantic-label-normal)]">
          탈퇴 API: <code>/api/auth/user/withdraw</code>
        </p>
        <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
          요청 성공 시 로컬 토큰(`accessToken`, `refreshToken`)은 즉시
          삭제됩니다.
        </p>
      </section>

      {withdrawMutation.isSuccess ? (
        <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4">
          <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
            회원 탈퇴가 완료되었습니다.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-3 h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 text-[var(--color-semantic-label-normal)]"
          >
            로그인 페이지로 이동
          </button>
        </section>
      ) : (
        <button
          type="button"
          onClick={handleWithdraw}
          disabled={withdrawMutation.isPending}
          className="mt-4 w-full h-11 rounded-lg bg-[var(--color-semantic-status-cautionary)] text-white text-body1 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {withdrawMutation.isPending ? '탈퇴 처리 중...' : '회원 탈퇴하기'}
        </button>
      )}

      {withdrawMutation.isError ? (
        <p className="mt-3 text-body3 text-[var(--color-semantic-status-cautionary)]">
          {getErrorMessage(withdrawMutation.error)}
        </p>
      ) : null}
    </div>
  );
}
