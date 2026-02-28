import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import BackIcon from '@/shared/assets/icons/header/back.svg?react';
import SearchIcon from '@/shared/assets/icons/header/search.svg?react';
import CartIcon from '@/shared/assets/icons/header/cart.svg?react';
import ArrowIcon from '@/shared/assets/icons/header/arrow.svg?react';
import XCircleIcon from '@/shared/assets/icons/header/x-circle.svg?react';
import StarIcon from '@/shared/assets/icons/store/star.svg?react';
import TimeIcon from '@/shared/assets/icons/store/time.svg?react';
import DeliveryFeeIcon from '@/shared/assets/icons/store/deliveryfee.svg?react';
import { searchStores } from '@/shared/api';

function formatPrice(amount) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function StoreCard({ store, onClick, isFirst }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 pb-4 text-left ${isFirst ? 'pt-0' : 'pt-4'}`}
      onClick={onClick}
    >
      <img
        src={store.thumbnailUrl}
        alt={store.storeName}
        className="w-[108px] h-[108px] rounded-lg object-cover shrink-0"
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <p className="text-[18px] leading-[26px] font-bold text-[var(--color-semantic-label-normal)] truncate">
          {store.storeName}
        </p>
        <p className="mt-1 text-body2 font-normal text-[var(--color-semantic-label-neutral)] truncate">
          {store.description}
        </p>
        <div className="mt-[6px] flex items-center gap-1 text-body2 font-normal">
          <StarIcon className="size-4 shrink-0" />
          <span className="font-bold text-[var(--color-semantic-label-normal)]">
            {store.totalRating.toFixed(1)}
          </span>
          <span className="font-normal text-[var(--color-semantic-label-alternative)]">
            ({store.reviewCount.toLocaleString('ko-KR')})
          </span>
          <span className="ml-3 flex items-center gap-1">
            <TimeIcon className="size-4 shrink-0" />
            <span className="font-normal text-[var(--color-semantic-label-normal)]">
              약 {store.deliveryTimeMin}분
            </span>
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-body2 font-normal">
          <DeliveryFeeIcon className="size-4 shrink-0" />
          <span className="text-[var(--color-semantic-label-normal)]">
            {store.deliveryFee.amount === 0
              ? '무료배달'
              : formatPrice(store.deliveryFee.amount)}
          </span>
          <span className="text-[var(--color-semantic-label-alternative)]">
            (최소주문 {formatPrice(store.minimumOrderAmount.amount)})
          </span>
        </div>
      </div>
    </button>
  );
}

const SORT_OPTIONS = [
  '기본순',
  '추천순',
  '주문 많은 순',
  '별점 높은 순',
  '가까운 순',
];

const MIN_ORDER_OPTIONS = [
  '5,000원 이하',
  '10,000원 이하',
  '12,000원 이하',
  '15,000원 이하',
];

const MIN_ORDER_MAP = {
  '5,000원 이하': 5000,
  '10,000원 이하': 10000,
  '12,000원 이하': 12000,
  '15,000원 이하': 15000,
};

export default function SearchResultPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [inputValue, setInputValue] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const [sort, setSort] = useState('기본순');
  const [minOrder, setMinOrder] = useState(null);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [instantDiscount, setInstantDiscount] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [minOrderOpen, setMinOrderOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['search-stores', initialQuery],
    queryFn: () => searchStores({ keyword: initialQuery }),
    enabled: !!initialQuery,
  });

  const rawStores = data?.stores ?? [];

  let filteredStores = rawStores;

  if (freeDelivery) {
    filteredStores = filteredStores.filter((s) => s.deliveryFee?.amount === 0);
  }

  if (minOrder) {
    const limit = MIN_ORDER_MAP[minOrder];
    filteredStores = filteredStores.filter(
      (s) => (s.minimumOrderAmount?.amount ?? Infinity) <= limit
    );
  }

  if (sort === '별점 높은 순') {
    filteredStores = [...filteredStores].sort(
      (a, b) => (b.totalRating ?? 0) - (a.totalRating ?? 0)
    );
  } else if (sort === '주문 많은 순') {
    filteredStores = [...filteredStores].sort(
      (a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
    );
  } else if (sort === '추천순') {
    filteredStores = [...filteredStores].sort(
      (a, b) =>
        (b.totalRating ?? 0) * (b.reviewCount ?? 0) -
        (a.totalRating ?? 0) * (a.reviewCount ?? 0)
    );
  }

  const stores = filteredStores;
  const total = stores.length;

  function handleSearch() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setSearchParams({ q: trimmed });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch();
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white shrink-0">
        <button onClick={() => navigate(-1)} className="shrink-0">
          <BackIcon className="size-5" />
        </button>
        <div
          className={`flex-1 h-10 flex items-center gap-2 px-3 bg-[var(--color-semantic-background-normal-normal)] border rounded-lg ${
            isFocused
              ? 'border-[var(--color-atomic-redOrange-90)]'
              : 'border-[var(--color-semantic-line-normal-normal)]'
          }`}
        >
          <SearchIcon className="size-5 shrink-0 [&_path]:fill-[var(--color-atomic-redOrange-80)]" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-body1 font-normal text-[var(--color-semantic-label-normal)] placeholder:text-[var(--color-semantic-label-alternative)] outline-none"
          />
          {inputValue && (
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setInputValue('')}
              className="shrink-0"
            >
              <XCircleIcon className="size-5" />
            </button>
          )}
        </div>
        <button onClick={() => navigate('/cart')} className="shrink-0">
          <CartIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-neutral)]" />
        </button>
      </div>

      {/* 필터 탭 */}
      <div className="relative shrink-0">
        <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* 정렬 */}
          <button
            className="flex items-center gap-1 h-[31px] px-3 rounded-full border border-[var(--color-atomic-coolNeutral-90)] bg-[var(--color-atomic-coolNeutral-98)] text-body2 font-medium text-[var(--color-semantic-label-normal)] shrink-0 whitespace-nowrap"
            onClick={() => {
              setSortOpen((v) => !v);
              setMinOrderOpen(false);
            }}
          >
            {sort}
            <ArrowIcon className="size-3.5" />
          </button>
          {/* 최소주문금액 */}
          <button
            className="flex items-center gap-1 h-[31px] px-3 rounded-full border border-[var(--color-atomic-coolNeutral-90)] bg-[var(--color-atomic-coolNeutral-98)] text-body2 font-medium text-[var(--color-semantic-label-normal)] shrink-0 whitespace-nowrap"
            onClick={() => {
              setMinOrderOpen((v) => !v);
              setSortOpen(false);
            }}
          >
            {minOrder ?? '최소주문금액'}
            <ArrowIcon className="size-3.5" />
          </button>
          {/* 배달팁 무료 */}
          <button
            className={`h-[31px] px-3 rounded-full border text-body2 font-medium shrink-0 whitespace-nowrap ${
              freeDelivery
                ? 'border-[var(--color-atomic-redOrange-80)] text-[var(--color-atomic-redOrange-80)] bg-[var(--color-atomic-redOrange-98)]'
                : 'border-[var(--color-atomic-coolNeutral-90)] bg-[var(--color-atomic-coolNeutral-98)] text-[var(--color-semantic-label-normal)]'
            }`}
            onClick={() => setFreeDelivery((v) => !v)}
          >
            배달팁 무료
          </button>
          {/* 즉시 할인 */}
          <button
            className={`h-[31px] px-3 rounded-full border text-body2 font-medium shrink-0 whitespace-nowrap ${
              instantDiscount
                ? 'border-[var(--color-atomic-redOrange-80)] text-[var(--color-atomic-redOrange-80)] bg-[var(--color-atomic-redOrange-98)]'
                : 'border-[var(--color-atomic-coolNeutral-90)] bg-[var(--color-atomic-coolNeutral-98)] text-[var(--color-semantic-label-normal)]'
            }`}
            onClick={() => setInstantDiscount((v) => !v)}
          >
            즉시 할인
          </button>
        </div>

        {/* 정렬 드롭다운  */}
        {sortOpen && (
          <div className="absolute top-full mt-1 left-4 z-50 bg-[var(--color-atomic-coolNeutral-98)] border border-[var(--color-atomic-coolNeutral-90)] rounded-2xl shadow-sm w-fit overflow-hidden">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt}
                className={`w-full text-left px-4 py-2 text-body2 font-medium whitespace-nowrap ${
                  opt === sort
                    ? 'text-[var(--color-atomic-redOrange-80)]'
                    : 'text-[var(--color-semantic-label-normal)]'
                }`}
                onClick={() => {
                  setSort(opt);
                  setSortOpen(false);
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* 최소주문금액 드롭다운*/}
        {minOrderOpen && (
          <div className="absolute top-full mt-1 left-4 z-50 bg-[var(--color-atomic-coolNeutral-98)] border border-[var(--color-atomic-coolNeutral-90)] rounded-2xl shadow-sm w-fit overflow-hidden">
            {MIN_ORDER_OPTIONS.map((opt) => (
              <button
                key={opt}
                className={`w-full text-left px-4 py-2 text-body2 font-medium whitespace-nowrap ${
                  opt === minOrder
                    ? 'text-[var(--color-atomic-redOrange-80)]'
                    : 'text-[var(--color-semantic-label-normal)]'
                }`}
                onClick={() => {
                  setMinOrder(opt);
                  setMinOrderOpen(false);
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-body2 text-[var(--color-semantic-label-alternative)]">
              검색 중...
            </p>
          </div>
        ) : (
          <>
            {/* 결과 수 */}
            <div className="px-4 pt-4">
              <p className="text-body2 font-normal text-[var(--color-semantic-label-normal)]">
                검색 결과{' '}
                <span className="font-medium text-[var(--color-atomic-redOrange-80)]">
                  {total.toLocaleString('ko-KR')} 개
                </span>
              </p>
            </div>

            {/* 가게 리스트 */}
            {stores.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2">
                <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
                  검색 결과가 없어요
                </p>
                <p className="text-body2 text-[var(--color-semantic-label-alternative)]">
                  다른 검색어로 시도해보세요
                </p>
              </div>
            ) : (
              <div className="pt-3">
                {stores.map((store, i) => (
                  <div key={store.storePublicId}>
                    <StoreCard
                      store={store}
                      onClick={() => navigate(`/stores/${store.storePublicId}`)}
                      isFirst={i === 0}
                    />
                    {i < stores.length - 1 && (
                      <div className="mx-4 h-px bg-[var(--color-semantic-line-normal-neutral)]" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
