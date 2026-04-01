import { useNavigate } from 'react-router-dom';

import BackIcon from '@/shared/assets/icons/header/back.svg?react';
import UserIcon from '@/shared/assets/icons/nav/mypage.svg?react';
import MotorcycleIcon from '@/shared/assets/icons/order-status/motocycle.svg?react';

function RoleCard({ icon, title, description, buttonLabel, onClick }) {
  return (
    <div className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="size-11 rounded-xl bg-[var(--color-atomic-coolNeutral-97)] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            {title}
          </p>
          <p className="mt-0.5 text-body3 text-[var(--color-semantic-label-alternative)]">
            {description}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="w-full h-11 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body1 font-semibold"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export default function SignupRolePage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto bg-white px-4 py-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 mb-4 text-body2 text-[var(--color-semantic-label-alternative)]"
      >
        <BackIcon className="size-5" />
        {'뒤로'}
      </button>
      <p className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        회원가입
      </p>
      <p className="mt-1 text-body2 text-[var(--color-semantic-label-alternative)]">
        이용할 계정을 선택해주세요.
      </p>

      <div className="mt-6 space-y-3">
        <RoleCard
          icon={
            <UserIcon className="size-6 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
          }
          title="주문자"
          description="음식 주문과 배달 조회를 할 수 있어요"
          buttonLabel="주문자로 가입"
          onClick={() => navigate('/signup/user')}
        />
        <RoleCard
          icon={
            <MotorcycleIcon className="size-6 [&_path]:stroke-[var(--color-semantic-label-alternative)]" />
          }
          title="라이더"
          description="배달 요청을 수락하고 수익을 관리할 수 있어요"
          buttonLabel="라이더로 가입"
          onClick={() => navigate('/signup/rider')}
        />
      </div>

      <p className="mt-4 text-center text-body3 text-[var(--color-semantic-label-alternative)]">
        이미 계정이 있으신가요?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-[var(--color-atomic-redOrange-80)] font-medium"
        >
          로그인
        </button>
      </p>

      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-3 w-full h-11 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 text-[var(--color-semantic-label-alternative)]"
      >
        로그인 없이 둘러보기
      </button>
    </div>
  );
}
