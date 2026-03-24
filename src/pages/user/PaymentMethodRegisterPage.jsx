import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { addPaymentMethod } from '@/shared/api';

export default function PaymentMethodRegisterPage() {
  const navigate = useNavigate();

  const [cardSegments, setCardSegments] = useState(['', '', '', '']);
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [password, setPassword] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const cardNumber = cardSegments.join('-');
  const isFormValid =
    cardSegments.every((s) => s.length === 4) &&
    expiryMonth.length === 2 &&
    expiryYear.length === 2 &&
    cvc.length === 3 &&
    password.length === 2 &&
    agreePrivacy;

  const createMutation = useMutation({
    mutationFn: addPaymentMethod,
    onSuccess: () => {
      navigate('/mypage/payment-methods');
    },
  });

  const handleSegmentChange = (index, value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    const next = [...cardSegments];
    next[index] = digits;
    setCardSegments(next);

    if (digits.length === 4 && index < 3) {
      const nextInput = document.querySelector(
        `[data-card-segment="${index + 1}"]`
      );
      nextInput?.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    createMutation.mutate({
      cardName: '새 카드',
      cardNumber,
      expiryMonth,
      expiryYear,
      cvc,
      password,
    });
  };

  return (
    <div className="flex min-h-full flex-col bg-white pb-4">
      <div className="flex-1">
        <div className="py-3">
          <p className="text-body1 font-bold text-[var(--color-semantic-label-normal)]">
            카드정보 입력
          </p>
          <p className="mt-1 text-caption1 text-[var(--color-semantic-label-alternative)]">
            (최초 등록 시에만 입력합니다)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Card Number */}
          <div>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--color-semantic-line-normal-normal)] px-3 py-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect
                  x="2"
                  y="5"
                  width="20"
                  height="14"
                  rx="2"
                  stroke="var(--color-semantic-label-alternative)"
                  strokeWidth="1.5"
                />
                <path
                  d="M2 10h20"
                  stroke="var(--color-semantic-label-alternative)"
                  strokeWidth="1.5"
                />
              </svg>
              {cardSegments.map((segment, index) => (
                <div key={index} className="flex flex-1 items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    data-card-segment={index}
                    value={segment}
                    onChange={(e) => handleSegmentChange(index, e.target.value)}
                    className="w-full text-center text-body2 outline-none"
                    maxLength={4}
                    placeholder="0000"
                  />
                  {index < 3 ? (
                    <span className="text-[var(--color-semantic-label-alternative)]">
                      -
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <p className="mt-1 text-caption2 text-[var(--color-semantic-label-alternative)]">
              카드는 본인명의만 등록 가능합니다.
            </p>
          </div>

          {/* Expiry Date */}
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] px-3 py-2">
                <p className="text-caption2 text-[var(--color-semantic-label-alternative)]">
                  유효기간 (MM)
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  value={expiryMonth}
                  onChange={(e) =>
                    setExpiryMonth(
                      e.target.value.replace(/\D/g, '').slice(0, 2)
                    )
                  }
                  className="mt-1 w-full text-body2 outline-none"
                  placeholder="MM"
                  maxLength={2}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] px-3 py-2">
                <p className="text-caption2 text-[var(--color-semantic-label-alternative)]">
                  유효기간 (YY)
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  value={expiryYear}
                  onChange={(e) =>
                    setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 2))
                  }
                  className="mt-1 w-full text-body2 outline-none"
                  placeholder="YY"
                  maxLength={2}
                />
              </div>
            </div>
          </div>

          {/* CVC */}
          <div className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] px-3 py-2">
            <p className="text-caption2 text-[var(--color-semantic-label-alternative)]">
              CVC
            </p>
            <input
              type="text"
              inputMode="numeric"
              value={cvc}
              onChange={(e) =>
                setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))
              }
              className="mt-1 w-full text-body2 outline-none"
              placeholder="카드 뒷면 3자리"
              maxLength={3}
            />
          </div>

          {/* Password */}
          <div className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] px-3 py-2">
            <p className="text-caption2 text-[var(--color-semantic-label-alternative)]">
              비밀번호
            </p>
            <input
              type="password"
              inputMode="numeric"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value.replace(/\D/g, '').slice(0, 2))
              }
              className="mt-1 w-full text-body2 outline-none"
              placeholder="비밀번호 (앞 2자리)"
              maxLength={2}
            />
          </div>

          {/* Privacy Agreement */}
          <label className="flex cursor-pointer items-center gap-3 py-2">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border ${
                agreePrivacy
                  ? 'border-[var(--color-atomic-redOrange-80)] bg-[var(--color-atomic-redOrange-80)]'
                  : 'border-[var(--color-semantic-line-normal-normal)]'
              }`}
            >
              {agreePrivacy ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </div>
            <span className="flex-1 text-body2 text-[var(--color-semantic-label-normal)]">
              카드사 개인정보 제 3자 제공
            </span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 5l5 5-5 5"
                stroke="var(--color-semantic-label-alternative)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
              className="hidden"
            />
          </label>
        </form>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isFormValid || createMutation.isPending}
        className={`mt-4 w-full rounded-xl py-3.5 text-body1 font-semibold ${
          isFormValid
            ? 'bg-[var(--color-atomic-redOrange-80)] text-white'
            : 'bg-[var(--color-semantic-background-normal-alternative)] text-[var(--color-semantic-label-alternative)]'
        }`}
      >
        {createMutation.isPending ? '등록 중...' : '등록'}
      </button>
    </div>
  );
}
