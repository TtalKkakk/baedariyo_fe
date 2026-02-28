import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { signupUser } from '@/shared/api';

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '회원가입 요청에 실패했습니다.'
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const isPasswordMismatch = useMemo(
    () =>
      passwordConfirm.length > 0 &&
      password.length > 0 &&
      password !== passwordConfirm,
    [password, passwordConfirm]
  );

  const canSubmit =
    email.trim() &&
    password &&
    passwordConfirm &&
    name.trim() &&
    nickname.trim() &&
    phoneNumber.trim() &&
    !isPasswordMismatch;

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      setIsSuccess(true);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    signupMutation.mutate({
      email: email.trim(),
      password,
      name: name.trim(),
      nickname: nickname.trim(),
      phoneNumber: phoneNumber.trim(),
    });
  };

  return (
    <div className="min-h-full bg-white px-4 py-6">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        사용자 회원가입
      </h1>
      <p className="mt-1 text-body2 text-[var(--color-semantic-label-alternative)]">
        회원가입 후 로그인해서 주문/리뷰 API를 사용할 수 있습니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="이메일"
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
          autoComplete="new-password"
          required
        />

        <input
          type="password"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          placeholder="비밀번호 확인"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          autoComplete="new-password"
          required
        />

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="이름"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          autoComplete="name"
          required
        />

        <input
          type="text"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="닉네임"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          required
        />

        <input
          type="tel"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          placeholder="휴대전화 번호"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          autoComplete="tel"
          required
        />

        {isPasswordMismatch ? (
          <p className="text-body3 text-[var(--color-semantic-status-cautionary)]">
            비밀번호가 일치하지 않습니다.
          </p>
        ) : null}

        {signupMutation.isError ? (
          <p className="text-body3 text-[var(--color-semantic-status-cautionary)]">
            {getErrorMessage(signupMutation.error)}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={signupMutation.isPending || !canSubmit}
          className="w-full h-11 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body1 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {signupMutation.isPending ? '가입 요청 중...' : '회원가입'}
        </button>
      </form>

      {isSuccess ? (
        <section className="mt-6 p-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)]">
          <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
            회원가입이 완료되었습니다.
          </p>
          <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
            로그인 화면으로 이동해서 인증 토큰을 발급해 주세요.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-3 h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 text-[var(--color-semantic-label-normal)]"
          >
            로그인 페이지로 이동
          </button>
        </section>
      ) : null}
    </div>
  );
}
