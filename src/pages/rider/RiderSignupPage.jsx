import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { signupRider } from '@/shared/api';
import BackIcon from '@/shared/assets/icons/header/back.svg?react';
import OpenIcon from '@/shared/assets/icons/open.svg?react';
import CloseIcon from '@/shared/assets/icons/close.svg?react';

const VEHICLE_TYPES = [
  { value: 'BICYCLE', label: '자전거', emoji: '🚲' },
  { value: 'MOTORCYCLE', label: '오토바이', emoji: '🛵' },
  { value: 'CAR', label: '자동차', emoji: '🚗' },
  { value: 'E_BICYCLE', label: '전기자전거', emoji: '⚡' },
  { value: 'E_SCOOTER', label: '전동킥보드', emoji: '🛴' },
  { value: 'WALKING', label: '도보', emoji: '🚶' },
  { value: 'ETC', label: '기타', emoji: '📦' },
];

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '회원가입 요청에 실패했습니다.'
  );
}

export default function RiderSignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('MOTORCYCLE');

  const isPasswordMismatch = useMemo(
    () =>
      password.length > 0 &&
      passwordConfirm.length > 0 &&
      password !== passwordConfirm,
    [password, passwordConfirm]
  );

  const canSubmit = Boolean(
    email.trim() &&
    password &&
    passwordConfirm &&
    name.trim() &&
    nickname.trim() &&
    phoneNumber.trim() &&
    vehicleType &&
    !isPasswordMismatch
  );

  const signupMutation = useMutation({
    mutationFn: () =>
      signupRider({
        email: email.trim(),
        password,
        name: name.trim(),
        nickname: nickname.trim(),
        phoneNumber: phoneNumber.replace(/-/g, ''),
        vehicleType,
      }),
    onSuccess: () => {
      navigate('/rider/login', { state: { fromSignup: true } });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canSubmit || signupMutation.isPending) {
      return;
    }

    signupMutation.mutate();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white px-4 py-6">
      <button
        type="button"
        onClick={() => navigate('/signup')}
        className="flex items-center gap-1 mb-4 text-body2 text-[var(--color-semantic-label-alternative)]"
      >
        <BackIcon className="size-5" />
        역할 선택
      </button>

      <p className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        라이더 회원가입
      </p>
      <p className="mt-1 text-body2 text-[var(--color-semantic-label-alternative)]">
        가입 완료 후 라이더 로그인으로 인증 토큰을 발급해 주세요.
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

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호"
            className="w-full h-11 px-3 pr-10 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
            autoComplete="new-password"
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

        <div className="relative">
          <input
            type={showPasswordConfirm ? 'text' : 'password'}
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            placeholder="비밀번호 확인"
            className={`w-full h-11 px-3 pr-10 rounded-lg border text-body2 outline-none ${
              isPasswordMismatch
                ? 'border-[var(--color-semantic-status-cautionary)]'
                : 'border-[var(--color-semantic-line-normal-normal)]'
            }`}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPasswordConfirm ? (
              <CloseIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
            ) : (
              <OpenIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
            )}
          </button>
        </div>

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
          onChange={(event) => setPhoneNumber(formatPhone(event.target.value))}
          placeholder="전화번호 (010-0000-0000)"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          autoComplete="tel"
          required
        />

        {isPasswordMismatch && (
          <p className="text-body3 text-[var(--color-semantic-status-cautionary)]">
            비밀번호가 일치하지 않습니다.
          </p>
        )}

        <div className="pt-2">
          <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] mb-2">
            이동수단
          </p>
          <div className="grid grid-cols-3 gap-2">
            {VEHICLE_TYPES.map((vehicle) => (
              <button
                key={vehicle.value}
                type="button"
                onClick={() => setVehicleType(vehicle.value)}
                className={`h-[68px] rounded-lg border flex flex-col items-center justify-center gap-1 ${
                  vehicleType === vehicle.value
                    ? 'border-[var(--color-atomic-redOrange-80)] bg-[var(--color-atomic-redOrange-80)]/5'
                    : 'border-[var(--color-semantic-line-normal-normal)]'
                }`}
              >
                <span className="text-[20px]">{vehicle.emoji}</span>
                <span
                  className={`text-body3 font-medium ${
                    vehicleType === vehicle.value
                      ? 'text-[var(--color-atomic-redOrange-80)]'
                      : 'text-[var(--color-semantic-label-alternative)]'
                  }`}
                >
                  {vehicle.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {signupMutation.isError && (
          <p className="text-body3 text-[var(--color-semantic-status-cautionary)]">
            {getErrorMessage(signupMutation.error)}
          </p>
        )}

        <button
          type="submit"
          disabled={signupMutation.isPending || !canSubmit}
          className="w-full h-11 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body1 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {signupMutation.isPending ? '가입 중...' : '라이더로 가입하기'}
        </button>
      </form>
    </div>
  );
}
