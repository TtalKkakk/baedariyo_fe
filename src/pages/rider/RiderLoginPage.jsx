import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginRider } from '@/shared/api';
import BackIcon from '@/shared/assets/icons/header/back.svg?react';
import OpenIcon from '@/shared/assets/icons/open.svg?react';
import CloseIcon from '@/shared/assets/icons/close.svg?react';
import { useProfileStore } from '@/shared/store';

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '배달원 로그인 요청에 실패했습니다.'
  );
}

export default function RiderLoginPage() {
  const navigate = useNavigate();
  const saveProfile = useProfileStore((state) => state.saveProfile);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginRider,
    onSuccess: (result) => {
      localStorage.setItem('accessToken', result.accessToken);

      if (result.refreshToken) {
        localStorage.setItem('refreshToken', result.refreshToken);
      }

      saveProfile({ email: email.trim() });

      navigate('/rider');
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (loginMutation.isPending || !email.trim() || !password) {
      return;
    }

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white px-4 py-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 mb-4 text-body2 text-[var(--color-semantic-label-alternative)]"
      >
        <BackIcon className="size-5" />
        뒤로
      </button>

      <p className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        라이더 로그인
      </p>
      <p className="mt-1 text-body2 text-[var(--color-semantic-label-alternative)]">
        로그인 성공 시 라이더 홈으로 이동합니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="email@example.com"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          autoComplete="email"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호"
            className="w-full h-11 px-3 pr-10 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <CloseIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
            ) : (
              <OpenIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending || !email.trim() || !password}
          className="w-full h-11 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body1 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? '로그인 중...' : '배달원 로그인'}
        </button>
      </form>

      {loginMutation.isError && (
        <p className="mt-3 text-body2 text-[var(--color-semantic-status-cautionary)]">
          {getErrorMessage(loginMutation.error)}
        </p>
      )}
    </div>
  );
}
