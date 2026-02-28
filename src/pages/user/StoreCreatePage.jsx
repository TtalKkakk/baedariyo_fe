import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createStore } from '@/shared/api';

const STORE_CATEGORIES = [
  { value: 'CAFE_DESSERT', label: '카페/디저트' },
  { value: 'WESTERN', label: '양식' },
  { value: 'CHINESE', label: '중식' },
  { value: 'KOREAN', label: '한식' },
  { value: 'JAPANESE', label: '일식' },
  { value: 'SNACK', label: '분식' },
  { value: 'FAST_FOOD', label: '패스트푸드' },
  { value: 'PIZZA', label: '피자' },
  { value: 'CHICKEN', label: '치킨' },
  { value: 'PORK_FISH', label: '돈까스/회' },
  { value: 'MEAT', label: '고기' },
];

function toPositiveInteger(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '가게 생성 요청에 실패했습니다.'
  );
}

export default function StoreCreatePage() {
  const navigate = useNavigate();

  const [storeName, setStoreName] = useState('');
  const [storeCategory, setStoreCategory] = useState('CHICKEN');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [minimumOrderAmount, setMinimumOrderAmount] = useState('15000');
  const [deliveryFee, setDeliveryFee] = useState('3000');
  const [createdStore, setCreatedStore] = useState(null);

  const createMutation = useMutation({
    mutationFn: createStore,
    onSuccess: (result) => {
      setCreatedStore(result);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const parsedMinimumOrderAmount = toPositiveInteger(minimumOrderAmount);
    const parsedDeliveryFee = toPositiveInteger(deliveryFee);

    if (!storeName.trim()) {
      window.alert('가게 이름을 입력해 주세요.');
      return;
    }

    if (!parsedMinimumOrderAmount) {
      window.alert('최소 주문 금액은 1 이상의 정수여야 합니다.');
      return;
    }

    if (!parsedDeliveryFee) {
      window.alert('배달비는 1 이상의 정수여야 합니다.');
      return;
    }

    createMutation.mutate({
      storeName: storeName.trim(),
      storeCategory,
      thumbnailUrl: thumbnailUrl.trim() || null,
      minimumOrderAmount: { amount: parsedMinimumOrderAmount },
      deliveryFee: { amount: parsedDeliveryFee },
    });
  };

  return (
    <div className="min-h-full bg-white px-4 py-6">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        가게 생성
      </h1>
      <p className="mt-1 text-body2 text-[var(--color-semantic-label-alternative)]">
        백엔드 `POST /api/stores` 연동 테스트용 폼입니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          type="text"
          value={storeName}
          onChange={(event) => setStoreName(event.target.value)}
          placeholder="가게 이름"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          required
        />

        <select
          value={storeCategory}
          onChange={(event) => setStoreCategory(event.target.value)}
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none bg-white"
        >
          {STORE_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        <input
          type="url"
          value={thumbnailUrl}
          onChange={(event) => setThumbnailUrl(event.target.value)}
          placeholder="썸네일 URL (선택)"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
        />

        <input
          type="number"
          value={minimumOrderAmount}
          onChange={(event) => setMinimumOrderAmount(event.target.value)}
          placeholder="최소 주문 금액"
          min={1}
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          required
        />

        <input
          type="number"
          value={deliveryFee}
          onChange={(event) => setDeliveryFee(event.target.value)}
          placeholder="배달비"
          min={1}
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          required
        />

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full h-11 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body1 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {createMutation.isPending ? '생성 중...' : '가게 생성'}
        </button>
      </form>

      {createMutation.isError ? (
        <div className="mt-3">
          <p className="text-body3 text-[var(--color-semantic-status-cautionary)]">
            {getErrorMessage(createMutation.error)}
          </p>
          {createMutation.error?.response?.status === 401 ? (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-2 h-8 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-caption1"
            >
              로그인하러 가기
            </button>
          ) : null}
        </div>
      ) : null}

      {createdStore ? (
        <section className="mt-6 rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4">
          <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
            가게 생성 완료
          </p>
          <p className="mt-2 text-body3 text-[var(--color-semantic-label-alternative)]">
            storePublicId: {createdStore?.storePublicId ?? '-'}
          </p>
          <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
            storeName: {createdStore?.storeName ?? '-'}
          </p>
          <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
            storeCategory: {createdStore?.storeCategory ?? '-'}
          </p>

          {createdStore?.storePublicId ? (
            <button
              type="button"
              onClick={() => navigate(`/stores/${createdStore.storePublicId}`)}
              className="mt-3 h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 text-[var(--color-semantic-label-normal)]"
            >
              생성된 가게 상세로 이동
            </button>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
