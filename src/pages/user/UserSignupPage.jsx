import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { signupUser } from '@/shared/api';
import { useAddressBookStore } from '@/shared/store';
import { loadDaumPostcode } from '@/shared/lib/loadDaumPostcode';
import BackIcon from '@/shared/assets/icons/header/back.svg?react';
import SearchIcon from '@/shared/assets/icons/header/search.svg?react';

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

const LABEL_PRESETS = ['집', '회사', '기타'];

export default function UserSignupPage() {
  const navigate = useNavigate();
  const addAddress = useAddressBookStore((s) => s.addAddress);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [roadAddress, setRoadAddress] = useState('');
  const [jibunAddress, setJibunAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [labelPreset, setLabelPreset] = useState('집');
  const [customLabel, setCustomLabel] = useState('');

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

  const handleAddressSearch = async () => {
    try {
      const daum = await loadDaumPostcode();
      new daum.Postcode({
        oncomplete: (data) => {
          setRoadAddress(data.roadAddress);
          setJibunAddress(data.jibunAddress || data.autoJibunAddress || '');
        },
      }).open();
    } catch {
      // 주소 검색 SDK 로드 실패 시 무시
    }
  };

  const signupMutation = useMutation({
    mutationFn: () =>
      signupUser({
        email: email.trim(),
        password,
        name: name.trim(),
        nickname: nickname.trim(),
        phoneNumber: phoneNumber.replace(/-/g, ''),
      }),
    onSuccess: () => {
      if (roadAddress) {
        const label =
          labelPreset === '기타' ? customLabel.trim() || '기타' : labelPreset;
        addAddress({
          label,
          recipientName: name.trim(),
          phoneNumber: phoneNumber.replace(/-/g, ''),
          roadAddress,
          jibunAddress,
          detailAddress,
          riderMemo: '',
          directions: '',
          latitude: null,
          longitude: null,
          isDefault: true,
        });
      }
      navigate('/login', { state: { fromSignup: true } });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || signupMutation.isPending) return;
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
        주문자 회원가입
      </p>
      <p className="mt-1 text-body2 text-[var(--color-semantic-label-alternative)]">
        가입 후 로그인해서 음식을 주문할 수 있어요.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          autoComplete="email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          autoComplete="new-password"
          required
        />

        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="비밀번호 확인"
          className={`w-full h-11 px-3 rounded-lg border text-body2 outline-none ${
            isPasswordMismatch
              ? 'border-[var(--color-semantic-status-cautionary)]'
              : 'border-[var(--color-semantic-line-normal-normal)]'
          }`}
          autoComplete="new-password"
          required
        />

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          autoComplete="name"
          required
        />

        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          required
        />

        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
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

        {/* 배달 주소 */}
        <div className="pt-2">
          <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] mb-1">
            배달 주소{' '}
            <span className="text-body3 font-normal text-[var(--color-semantic-label-alternative)]">
              (선택)
            </span>
          </p>

          <button
            type="button"
            onClick={handleAddressSearch}
            className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 text-[var(--color-semantic-label-normal)] flex items-center justify-center gap-2"
          >
            <SearchIcon className="size-5 shrink-0 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
            {roadAddress ? '주소 다시 검색' : '주소 검색'}
          </button>

          {roadAddress && (
            <div className="mt-3 space-y-3">
              <input
                type="text"
                value={roadAddress}
                readOnly
                placeholder="도로명 주소"
                className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 text-[var(--color-semantic-label-alternative)] bg-[var(--color-atomic-coolNeutral-97)] outline-none cursor-default"
              />
              <input
                type="text"
                value={jibunAddress}
                readOnly
                placeholder="지번 주소"
                className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 text-[var(--color-semantic-label-alternative)] bg-[var(--color-atomic-coolNeutral-97)] outline-none cursor-default"
              />
              <input
                type="text"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="상세 주소 (동/호수 등)"
                className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
              />

              <div>
                <p className="text-body3 text-[var(--color-semantic-label-alternative)] mb-2">
                  주소 별칭
                </p>
                <div className="flex gap-2">
                  {LABEL_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setLabelPreset(preset)}
                      className={`h-9 px-4 rounded-full text-body3 font-medium border ${
                        labelPreset === preset
                          ? 'bg-[var(--color-atomic-redOrange-80)] border-[var(--color-atomic-redOrange-80)] text-white'
                          : 'border-[var(--color-semantic-line-normal-normal)] text-[var(--color-semantic-label-alternative)]'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                {labelPreset === '기타' && (
                  <input
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="별칭 직접 입력 (최대 10자)"
                    maxLength={10}
                    className="mt-2 w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
                  />
                )}
              </div>
            </div>
          )}
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
          {signupMutation.isPending ? '가입 중...' : '주문자로 가입하기'}
        </button>
      </form>
    </div>
  );
}
