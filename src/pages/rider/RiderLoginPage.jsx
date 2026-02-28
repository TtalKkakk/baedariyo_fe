import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginRider } from '@/shared/api';

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '배달원 로그인 요청에 실패했습니다.'
  );
}

export default function RiderLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginResult, setLoginResult] = useState(null);

  const loginMutation = useMutation({
    mutationFn: loginRider,
    onSuccess: (result) => {
      localStorage.setItem('accessToken', result.accessToken);

      if (result.refreshToken) {
        localStorage.setItem('refreshToken', result.refreshToken);
      }

      setLoginResult(result);
      navigate('/rider');
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  const clearToken = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setLoginResult(null);
  };

  return (
    <div className="min-h-full bg-white px-4 py-6">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        배달원 로그인
      </h1>
      <p className="mt-1 text-body2 text-[var(--color-semantic-label-alternative)]">
        로그인 성공 시 `/rider`로 이동합니다.
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
          {loginMutation.isPending ? '로그인 중...' : '배달원 로그인'}
        </button>
      </form>

      {loginMutation.isError ? (
        <p className="mt-3 text-body2 text-[var(--color-semantic-status-cautionary)]">
          {getErrorMessage(loginMutation.error)}
        </p>
      ) : null}

      {loginResult ? (
        <section className="mt-6 p-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)]">
          <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
            로그인 성공
          </p>
          <p className="mt-1 break-all text-body3 text-[var(--color-semantic-label-alternative)]">
            accessToken: {loginResult.accessToken}
          </p>
          <button
            type="button"
            onClick={clearToken}
            className="mt-3 h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2"
          >
            토큰 삭제
          </button>
        </section>
      ) : null}
    </div>
  );
}
