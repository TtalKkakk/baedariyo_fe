import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';

import ArrowIcon from '@/shared/assets/icons/header/arrow.svg?react';
import StarIcon from '@/shared/assets/icons/store/star.svg?react';
import { CATEGORIES } from '@/shared/lib/categories';
import TimeIcon from '@/shared/assets/icons/store/time.svg?react';
import DeliveryFeeIcon from '@/shared/assets/icons/store/deliveryfee.svg?react';
import { searchStores } from '@/shared/api';
import { BottomModal } from '@/shared/ui';


const SORT_OPTIONS = ['기본순', '추천순', '주문 많은 순', '별점 높은 순', '가까운 순'];
const RATING_OPTIONS = ['전체', '4.5점 이상', '4.0점 이상', '3.5점 이상', '3.0점 이상'];
const MIN_ORDER_OPTIONS = ['전체', '5,000원 이하', '10,000원 이하', '12,000원 이하', '15,000원 이하'];

const RATING_MAP = {
  '4.5점 이상': 4.5,
  '4.0점 이상': 4.0,
  '3.5점 이상': 3.5,
  '3.0점 이상': 3.0,
};

const MIN_ORDER_MAP = {
  '5,000원 이하': 5000,
  '10,000원 이하': 10000,
  '12,000원 이하': 12000,
  '15,000원 이하': 15000,
};

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

export default function CategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const activeCategory =
    CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [sort, setSort] = useState('기본순');
  const [rating, setRating] = useState('전체');
  const [minOrder, setMinOrder] = useState(null);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [instantDiscount, setInstantDiscount] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [minOrderOpen, setMinOrderOpen] = useState(false);

  const sentinelRef = useRef(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['category-stores', activeCategory.apiValue],
    queryFn: ({ pageParam = 0 }) =>
      searchStores({ storeCategory: activeCategory.apiValue, page: pageParam, size: 20 }),
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage?.totalCount ?? 0;
      const fetched = allPages.flatMap((p) => p?.stores ?? p ?? []).length;
      return fetched < total ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) fetchNextPage(); },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const rawStores = data?.pages.flatMap((p) => p?.stores ?? p ?? []) ?? [];

  let filteredStores = rawStores;

  if (freeDelivery) {
    filteredStores = filteredStores.filter((s) => s.deliveryFee?.amount === 0);
  }

  if (rating !== '전체') {
    const minRating = RATING_MAP[rating];
    filteredStores = filteredStores.filter(
      (s) => (s.totalRating ?? 0) >= minRating
    );
  }

  if (minOrder && minOrder !== '전체') {
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

  return (
  <>
    <div className="relative -mx-4 -mt-2 bg-white">
      {/* 카테고리 탭 */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex items-end overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategory.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  navigate(`/category/${cat.id}`);
                  setIsCategoryOpen(false);
                }}
                className={`relative shrink-0 px-[14px] pt-[6px] pb-3 text-body2 whitespace-nowrap ${
                  isActive
                    ? 'font-bold text-[var(--color-atomic-redOrange-80)]'
                    : 'font-medium text-[var(--color-semantic-label-alternative)]'
                }`}
              >
                {cat.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[var(--color-atomic-redOrange-80)]" />
                )}
              </button>
            );
          })}
          <button
            onClick={() => setIsCategoryOpen((v) => !v)}
            className="shrink-0 px-3 py-3 border-b-2 border-transparent"
          >
            <ArrowIcon
              className={`size-[16px] transition-transform duration-200 [&_path]:fill-[var(--color-semantic-label-alternative)] ${isCategoryOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
        <div className="mx-4 h-px bg-[var(--color-semantic-line-normal-neutral)]" />
      </div>

      {/* 카테고리 드롭다운 오버레이 */}
      {isCategoryOpen && (
        <div className="absolute top-0 left-0 right-0 z-30 bg-white pb-3 rounded-b-3xl">
          <div className="grid grid-cols-5 gap-y-3 px-4 pt-4 pb-3">
            {CATEGORIES.map((cat) => {
              const isActive = cat.id === activeCategory.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    navigate(`/category/${cat.id}`);
                    setIsCategoryOpen(false);
                  }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <img src={cat.icon} alt={cat.label} className="w-14 h-14" />
                  <span
                    className={`text-[12px] text-center whitespace-nowrap ${
                      isActive
                        ? 'font-bold text-[var(--color-atomic-redOrange-80)]'
                        : 'font-medium text-[var(--color-semantic-label-normal)]'
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setIsCategoryOpen(false)}
            className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-30 flex items-center justify-center w-6 h-6 bg-white rounded-lg shadow-md"
          >
            <ArrowIcon className="size-4 rotate-180 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
          </button>
        </div>
      )}

      {/* 필터 */}
      <div className="sticky top-[45px] z-10 bg-white">
        <div className="flex items-center gap-2 px-4 pt-4 pb-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            className="flex items-center gap-1 h-[31px] px-3 rounded-full border border-[var(--color-atomic-coolNeutral-90)] bg-[var(--color-atomic-coolNeutral-98)] text-body2 font-medium text-[var(--color-semantic-label-normal)] shrink-0 whitespace-nowrap"
            onClick={() => {
              setSortOpen((v) => !v);
              setRatingOpen(false);
              setMinOrderOpen(false);
            }}
          >
            {sort}
            <ArrowIcon className="size-3.5" />
          </button>
          <button
            className="flex items-center gap-1 h-[31px] px-3 rounded-full border border-[var(--color-atomic-coolNeutral-90)] bg-[var(--color-atomic-coolNeutral-98)] text-body2 font-medium text-[var(--color-semantic-label-normal)] shrink-0 whitespace-nowrap"
            onClick={() => {
              setRatingOpen((v) => !v);
              setSortOpen(false);
              setMinOrderOpen(false);
            }}
          >
            {rating === '전체' ? '별점' : rating}
            <ArrowIcon className="size-3.5" />
          </button>
          <button
            className="flex items-center gap-1 h-[31px] px-3 rounded-full border border-[var(--color-atomic-coolNeutral-90)] bg-[var(--color-atomic-coolNeutral-98)] text-body2 font-medium text-[var(--color-semantic-label-normal)] shrink-0 whitespace-nowrap"
            onClick={() => {
              setMinOrderOpen((v) => !v);
              setSortOpen(false);
              setRatingOpen(false);
            }}
          >
            {minOrder ?? '최소주문금액'}
            <ArrowIcon className="size-3.5" />
          </button>
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
      </div>

      {/* 콘텐츠 */}
      <div className="pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-body2 text-[var(--color-semantic-label-alternative)]">
              불러오는 중...
            </p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
              주변 가게가 없어요
            </p>
            <p className="text-body2 text-[var(--color-semantic-label-alternative)]">
              다른 카테고리를 선택해보세요
            </p>
          </div>
        ) : (
          <div className="pt-3">
            {filteredStores.map((store, i) => (
              <div key={store.storePublicId}>
                <StoreCard
                  store={store}
                  onClick={() => navigate(`/stores/${store.storePublicId}`)}
                  isFirst={i === 0}
                />
                {i < filteredStores.length - 1 && (
                  <div className="mx-4 h-px bg-[var(--color-semantic-line-normal-neutral)]" />
                )}
              </div>
            ))}
          </div>
        )}
        <div ref={sentinelRef} className="h-4" />
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <p className="text-body2 text-[var(--color-semantic-label-alternative)]">불러오는 중...</p>
          </div>
        )}
      </div>
    </div>

    {isCategoryOpen && (
      <div
        className="absolute top-14 left-0 right-0 bottom-0 z-20 bg-black/40"
        onClick={() => setIsCategoryOpen(false)}
      />
    )}

    <BottomModal title="정렬" isOpen={sortOpen} onClose={() => setSortOpen(false)}>
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt}
          className={`w-full text-left px-6 py-4 text-body1 text-[var(--color-semantic-label-normal)] ${opt === sort ? 'font-bold' : 'font-normal'}`}
          onClick={() => { setSort(opt); setSortOpen(false); }}
        >
          {opt}
        </button>
      ))}
    </BottomModal>

    <BottomModal title="별점" isOpen={ratingOpen} onClose={() => setRatingOpen(false)}>
      {RATING_OPTIONS.map((opt) => (
        <button
          key={opt}
          className={`w-full text-left px-6 py-4 text-body1 text-[var(--color-semantic-label-normal)] ${opt === rating ? 'font-bold' : 'font-normal'}`}
          onClick={() => { setRating(opt); setRatingOpen(false); }}
        >
          {opt}
        </button>
      ))}
    </BottomModal>

    <BottomModal title="최소주문금액" isOpen={minOrderOpen} onClose={() => setMinOrderOpen(false)}>
      {MIN_ORDER_OPTIONS.map((opt) => (
        <button
          key={opt}
          className={`w-full text-left px-6 py-4 text-body1 text-[var(--color-semantic-label-normal)] ${(opt === '전체' ? minOrder === null : opt === minOrder) ? 'font-bold' : 'font-normal'}`}
          onClick={() => { setMinOrder(opt === '전체' ? null : opt); setMinOrderOpen(false); }}
        >
          {opt}
        </button>
      ))}
    </BottomModal>
  </>
  );
}
