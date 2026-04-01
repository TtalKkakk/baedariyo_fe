import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// import { getUserProfile } from '@/shared/api';
import { useProfileStore } from '@/shared/store';
import { BottomModal } from '@/shared/ui/BottomModal';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { Toast } from '@/shared/ui/Toast';
import MotorcycleIcon from '@/shared/assets/icons/order-status/motocycle.svg?react';

function UserAvatar() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-semantic-background-normal-alternative)]">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="8"
          r="4"
          stroke="var(--color-semantic-label-alternative)"
          strokeWidth="1.5"
        />
        <path
          d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
          stroke="var(--color-semantic-label-alternative)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function MenuItem({ icon, label, onClick, hasArrow = true }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 py-3.5"
    >
      <span className="text-[var(--color-semantic-label-alternative)]">
        {icon}
      </span>
      <span className="flex-1 text-left text-body2 text-[var(--color-semantic-label-normal)]">
        {label}
      </span>
      {hasArrow ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M7.5 5l5 5-5 5"
            stroke="var(--color-semantic-label-alternative)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </button>
  );
}

function ReviewIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TermsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 7h8M8 11h8M8 15h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M14.5 9.5a2.5 2.5 0 10-3.5 2.3V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="16"
        r="0.5"
        fill="currentColor"
        stroke="currentColor"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MyPage() {
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const resetProfile = useProfileStore((state) => state.resetProfile);

  const accessToken = localStorage.getItem('accessToken');
  const isLoggedIn = Boolean(accessToken);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const { data: serverProfile } = useQuery({
    queryKey: ['user-profile'],
    // queryFn: getUserProfile,
    enabled: isLoggedIn,
  });

  const displayProfile = serverProfile ?? profile;
  const displayName =
    displayProfile.name || displayProfile.nickname || '사용자';
  const displayEmail = displayProfile.email || '';

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    resetProfile();
    setShowLogoutModal(false);
    showToast('로그아웃 하였습니다.');
  };

  const handleLoginClick = () => {
    if (isLoggedIn) {
      navigate('/mypage/profile');
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="min-h-full bg-white pb-4">
      {/* Profile Section */}
      <section className="py-4">
        <button
          type="button"
          onClick={handleLoginClick}
          className="flex w-full items-center gap-3"
        >
          <UserAvatar />
          {isLoggedIn ? (
            <div className="flex flex-1 items-center justify-between">
              <div className="text-left">
                <p className="text-body1 font-bold text-[var(--color-semantic-label-normal)]">
                  {displayName} 님
                </p>
                <p className="mt-0.5 text-caption1 text-[var(--color-semantic-label-alternative)]">
                  {displayEmail}
                </p>
              </div>
              <span className="rounded-lg border border-[var(--color-semantic-line-normal-normal)] px-3 py-1.5 text-caption1 text-[var(--color-semantic-label-normal)]">
                프로필 편집
              </span>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-between">
              <p className="text-body1 font-medium text-[var(--color-semantic-label-normal)]">
                로그인하고 혜택받기
              </p>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 5l5 5-5 5"
                  stroke="var(--color-semantic-label-alternative)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </button>
      </section>

      <hr className="border-[var(--color-semantic-line-normal-normal)]" />

      {/* 내 활동 */}
      <section className="py-3">
        <p className="py-2 text-caption1 font-semibold text-[var(--color-semantic-label-alternative)]">
          내 활동
        </p>
        <MenuItem
          icon={<ReviewIcon />}
          label="내가 쓴 리뷰"
          onClick={() => navigate('/mypage/reviews')}
        />
        <MenuItem
          icon={<PaymentIcon />}
          label="결제 수단 관리"
          onClick={() => navigate('/mypage/payment-methods')}
        />
      </section>

      {/* Separator */}
      <div className="h-3 bg-[var(--color-semantic-background-normal-alternative)]" />

      {/* 설정 */}
      <section className="py-3">
        <p className="py-2 text-caption1 font-semibold text-[var(--color-semantic-label-alternative)]">
          설정
        </p>
        <MenuItem
          icon={<TermsIcon />}
          label="약관 및 정책"
          onClick={() => navigate('/mypage/terms')}
          hasArrow={false}
        />
        <MenuItem
          icon={<SupportIcon />}
          label="고객센터"
          onClick={() => navigate('/mypage/support')}
        />
        <MenuItem
          icon={<LogoutIcon />}
          label="로그아웃"
          onClick={() =>
            isLoggedIn ? setShowLogoutModal(true) : setShowLoginModal(true)
          }
        />
      </section>

      {/* Login Bottom Modal */}
      <BottomModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title=""
      >
        <div className="px-6 pb-4">
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-atomic-redOrange-80)]">
              <MotorcycleIcon className="size-9 [&_path]:stroke-white" />
            </div>
            <p className="text-body1 font-bold text-[var(--color-semantic-label-normal)]">
              배달이요
            </p>
            <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
              빠른 배달, 맛있는 배달
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowLoginModal(false);
              navigate('/login');
            }}
            className="mt-2 w-full rounded-lg border border-[var(--color-atomic-redOrange-80)] py-2.5 text-center text-body2 font-medium text-[var(--color-atomic-redOrange-80)]"
          >
            이메일로 로그인
          </button>

          <button
            type="button"
            onClick={() => {
              setShowLoginModal(false);
              navigate('/signup');
            }}
            className="mt-2 w-full rounded-lg bg-[var(--color-atomic-redOrange-80)] py-2.5 text-center text-body2 font-semibold text-white"
          >
            회원가입
          </button>
        </div>
      </BottomModal>

      {/* Logout Confirm Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="로그아웃 하시겠어요?"
        description="로그아웃 하면 로그인 화면으로 돌아갑니다."
        confirmLabel="로그아웃"
        cancelLabel="취소"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        isDestructive
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast({ visible: false, message: '' })}
      />
    </div>
  );
}
