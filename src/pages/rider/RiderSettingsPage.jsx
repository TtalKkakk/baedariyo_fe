import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { withdrawRider } from '@/shared/api';

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '배달원 탈퇴 요청에 실패했습니다.'
  );
}

export default function RiderSettingsPage() {
  const navigate = useNavigate();

  const withdrawMutation = useMutation({
    mutationFn: withdrawRider,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/rider/login');
  };

  const handleWithdraw = () => {
    const isConfirmed = window.confirm(
      '정말 탈퇴하시겠습니까? 배달원 계정 복구는 지원되지 않습니다.'
    );
    if (!isConfirmed) return;
    withdrawMutation.mutate();
  };

  return (
    <div className="min-h-full bg-white px-4 py-6">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        배달원 설정
      </h1>
      <p className="mt-2 text-body3 text-[var(--color-semantic-label-alternative)]">
        계정 보안과 인증 토큰 관련 작업을 수행할 수 있습니다.
      </p>

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4 space-y-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full h-10 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
        >
          로그아웃
        </button>

        {withdrawMutation.isSuccess ? (
          <div className="rounded-lg border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] p-3">
            <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
              배달원 탈퇴가 완료되었습니다.
            </p>
            <button
              type="button"
              onClick={() => navigate('/rider/login')}
              className="mt-2 h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 text-[var(--color-semantic-label-normal)]"
            >
              로그인 페이지로 이동
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleWithdraw}
            disabled={withdrawMutation.isPending}
            className="w-full h-10 rounded-lg bg-[var(--color-semantic-status-cautionary)] text-white text-body2 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {withdrawMutation.isPending ? '탈퇴 처리 중...' : '배달원 탈퇴'}
          </button>
        )}
      </section>

      {withdrawMutation.isError ? (
        <p className="mt-3 text-body3 text-[var(--color-semantic-status-cautionary)]">
          {getErrorMessage(withdrawMutation.error)}
        </p>
      ) : null}
    </div>
  );
}
