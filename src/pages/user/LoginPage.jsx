import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { loginUser } from '@/shared/api';
import { useProfileStore, useAddressBookStore } from '@/shared/store';
import BackIcon from '@/shared/assets/icons/header/back.svg?react';

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '로그인 요청에 실패했습니다.'
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const saveProfile = useProfileStore((state) => state.saveProfile);
  const clearAddresses = useAddressBookStore((s) => s.clearAddresses);
  const addAddress = useAddressBookStore((s) => s.addAddress);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (result) => {
      localStorage.setItem('accessToken', result.accessToken);
      if (result.refreshToken) {
        localStorage.setItem('refreshToken', result.refreshToken);
      }
      const prevEmail = localStorage.getItem('loggedInEmail');
      const isDifferentUser = prevEmail && prevEmail !== result.email;

      saveProfile({
        email: result.email,
        name: result.name,
        nickname: result.nickname,
        phoneNumber: result.phoneNumber,
      });
      localStorage.setItem('loggedInEmail', result.email);

      if (isDifferentUser) {
        clearAddresses();
        localStorage.removeItem('mock-payments');
        localStorage.removeItem('mock-reviews');
      }
      const pendingAddress = location.state?.pendingAddress;
      if (pendingAddress) {
        addAddress({ ...pendingAddress, isDefault: true });
      }
      navigate('/mypage', { replace: true });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
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
        로그인
      </p>
      <p className="mt-1 text-body2 text-[var(--color-semantic-label-alternative)]">
        로그인 후 주문/리뷰 서비스를 이용할 수 있어요.
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
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="비밀번호"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          autoComplete="current-password"
          required
        />
        <button
          type="submit"
          disabled={loginMutation.isPending || !email.trim() || !password}
          className="w-full h-11 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body1 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? '로그인 중...' : '로그인'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full h-11 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 text-[var(--color-semantic-label-alternative)]"
        >
          로그인 없이 둘러보기
        </button>
      </form>

      {loginMutation.isError ? (
        <p className="mt-3 text-body2 text-[var(--color-semantic-status-cautionary)]">
          {getErrorMessage(loginMutation.error)}
        </p>
      ) : null}
    </div>
  );
}
