import { useNavigate } from 'react-router-dom';

import { useProfileStore } from '@/shared/store';

const STORAGE_KEYS = [
  'accessToken',
  'refreshToken',
  'cart-storage',
  'address-book-storage',
  'notification-storage',
  'profile-storage',
];

export default function SecurityPage() {
  const navigate = useNavigate();
  const resetProfile = useProfileStore((state) => state.resetProfile);

  const hasToken = Boolean(localStorage.getItem('accessToken'));

  const clearAuthTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const clearLocalAppData = () => {
    STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    resetProfile();
    window.location.reload();
  };

  return (
    <div className="min-h-full bg-white px-4 py-6">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        보안 설정
      </h1>
      <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
        토큰 상태 확인 및 로컬 저장 데이터 정리를 수행할 수 있습니다.
      </p>

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
        <p className="text-body2 font-medium text-[var(--color-semantic-label-normal)]">
          인증 상태: {hasToken ? '로그인됨' : '로그아웃됨'}
        </p>
        <p className="mt-1 text-caption1 text-[var(--color-semantic-label-alternative)]">
          accessToken {hasToken ? '존재' : '없음'}
        </p>

        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={clearAuthTokens}
            className="w-full h-10 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
          >
            로그아웃(토큰 삭제)
          </button>

          <button
            type="button"
            onClick={clearLocalAppData}
            className="w-full h-10 rounded-lg bg-[var(--color-semantic-status-cautionary)] text-white text-body2 font-semibold"
          >
            로컬 데이터 전체 초기화
          </button>
        </div>
      </section>
    </div>
  );
}
