import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { getStoreDetail } from '@/shared/api';
import { useCartStore } from '@/shared/store';
import { BottomSheet } from '@/shared/ui';
import ArrowIcon from '@/shared/assets/icons/header/arrow.svg?react';
import BackIcon from '@/shared/assets/icons/header/back.svg?react';
import HeartIcon from '@/shared/assets/icons/store/heart.svg?react';
import HeartFilledIcon from '@/shared/assets/icons/store/heart-filled.svg?react';
import PlusIcon from '@/shared/assets/icons/store/plus.svg?react';
import ShareIcon from '@/shared/assets/icons/store/share.svg?react';
import StarIcon from '@/shared/assets/icons/store/star.svg?react';
import TimeIcon from '@/shared/assets/icons/store/time.svg?react';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return UUID_REGEX.test(value);
}

function formatPrice(price) {
  const amount = typeof price === 'number' ? price : price?.amount;
  if (typeof amount !== 'number') return '-';
  return `${amount.toLocaleString('ko-KR')}원`;
}

function getMenuDisplayPrice(menu) {
  const baseAmount =
    typeof menu?.price === 'number'
      ? menu.price
      : (menu?.price?.amount ?? null);

  if (baseAmount === 0) {
    const absoluteGroup = (menu?.menuOptionGroups ?? []).find(
      (g) => g.absolutePrice === true
    );
    if (absoluteGroup?.options?.length > 0) {
      const prices = absoluteGroup.options
        .map((o) =>
          typeof o.optionPrice === 'number'
            ? o.optionPrice
            : (o.optionPrice?.amount ?? 0)
        )
        .filter((p) => p > 0);
      if (prices.length > 0) {
        const min = Math.min(...prices);
        return `${min.toLocaleString('ko-KR')}원`;
      }
    }
  }

  return formatPrice(menu?.price);
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '가게 정보를 불러오지 못했습니다.'
  );
}

export default function StoreDetailPage() {
  const navigate = useNavigate();
  const { storeId = '' } = useParams();
  const trimmedStoreId = storeId.trim();
  const canFetch = isUuid(trimmedStoreId);

  const [activeTab, setActiveTab] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const sectionRefs = useRef([]);
  const scrollRef = useRef(null);

  const cartItems = useCartStore((state) => state.items);
  const storeCartItems = cartItems.filter(
    (item) => item.storePublicId === trimmedStoreId
  );
  const cartTotalAmount = storeCartItems.reduce((sum, item) => {
    const optionTotal = item.selectedOptions.reduce(
      (s, o) => s + (o.optionPriceAmount ?? 0),
      0
    );
    return sum + (item.basePriceAmount + optionTotal) * item.quantity;
  }, 0);
  const cartTotalCount = storeCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const {
    data: store,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['store-detail', trimmedStoreId],
    queryFn: () => getStoreDetail(trimmedStoreId),
    enabled: canFetch,
    retry: 1,
  });

  if (!canFetch) {
    return (
      <div className="py-6">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          잘못된 가게 ID입니다.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-6">
        <p className="text-body1 text-[var(--color-semantic-label-normal)]">
          가게 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (isError) {
    const isUnauthorized = error?.response?.status === 401;
    return (
      <div className="py-6">
        <p className="text-body1 font-semibold text-[var(--color-semantic-status-cautionary)]">
          {getErrorMessage(error)}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
          >
            다시 시도
          </button>
          {isUnauthorized && (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
            >
              로그인하러 가기
            </button>
          )}
        </div>
      </div>
    );
  }

  const menuGroups = Array.isArray(store?.menuGroups) ? store.menuGroups : [];
  const menuGroupsWithItems = menuGroups.filter((g) => g.menus?.length > 0);

  function handleTabClick(index) {
    setActiveTab(index);
    const groupId = menuGroups[index]?.id;
    const sectionIndex = menuGroupsWithItems.findIndex((g) => g.id === groupId);
    if (sectionIndex !== -1) {
      sectionRefs.current[sectionIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  return (
    <div className="bg-white h-full -mx-4 -mt-2 -mb-2 flex flex-col min-h-0 relative">
      {/* Floating header */}
      <div
        className={`absolute top-0 left-0 right-0 z-40 h-12 flex items-center px-4 transition-colors duration-200 ${isHeaderVisible ? 'bg-white' : 'bg-transparent'}`}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${isHeaderVisible ? '' : 'bg-white/80'}`}
        >
          <BackIcon className="size-5" />
        </button>
        {isHeaderVisible ? (
          <span className="ml-3 text-[18px] font-bold text-[var(--color-semantic-label-normal)] truncate">
            {store?.storeName ?? ''}
          </span>
        ) : (
          <div className="ml-auto flex items-center gap-3">
            <button type="button" aria-label="공유">
              <ShareIcon className="size-[20px]" />
            </button>
            <button
              type="button"
              aria-label="찜하기"
              onClick={() => setIsLiked((prev) => !prev)}
            >
              {isLiked ? (
                <HeartFilledIcon className="size-[20px]" />
              ) : (
                <HeartIcon className="size-[20px] [&_path]:fill-[var(--color-semantic-label-normal)]" />
              )}
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pb-4 bg-white"
        onScroll={() =>
          setIsHeaderVisible((scrollRef.current?.scrollTop ?? 0) > 150)
        }
      >
        {/* Hero Image */}
        {store?.thumbnailUrl && (
          <img
            src={store.thumbnailUrl}
            alt={store.storeName}
            className="w-full h-[200px] object-cover"
          />
        )}

        {/* Store Info */}
        <div className="px-4 pt-4 pb-5">
          <div className="flex items-start justify-between gap-2">
            <p className="flex-1 text-[24px] font-bold leading-snug text-[var(--color-semantic-label-normal)] truncate">
              {store?.storeName ?? '가게 이름 없음'}
            </p>
          </div>

          {/* Rating row */}
          <button
            type="button"
            onClick={() => navigate(`/stores/${trimmedStoreId}/reviews`)}
            className="flex items-center gap-1 mt-2"
          >
            <StarIcon className="w-4 h-4 [&_path]:fill-[var(--color-semantic-status-favorite)]" />
            <span className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
              {store?.totalRating ?? 0}
            </span>
            <span className="text-body2 text-[var(--color-semantic-label-alternative)]">
              ({(store?.reviewCount ?? 0).toLocaleString('ko-KR')})
            </span>
            <ArrowIcon className="size-4 -rotate-90 [&_path]:fill-[var(--color-semantic-label-normal)]" />
          </button>

          {/* Info rows */}
          <div className="mt-3 space-y-[6px]">
            <div className="flex gap-2">
              <span className="w-14 text-body3 text-[var(--color-semantic-label-alternative)]">
                최소주문
              </span>
              <span className="text-body3 text-[var(--color-semantic-label-normal)]">
                {formatPrice(store?.minimumOrderAmount)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-14 text-body3 text-[var(--color-semantic-label-alternative)]">
                배달비
              </span>
              <span className="text-body3 text-[var(--color-semantic-label-normal)]">
                {formatPrice(store?.deliveryFee)}
              </span>
              {store?.deliveryTimeMin && (
                <div className="flex items-center gap-2">
                  <div className="w-px h-3 bg-[var(--color-semantic-line-normal-normal)]" />
                  <div className="flex items-center gap-1">
                    <TimeIcon className="size-4" />
                    <span className="text-body3 text-[var(--color-semantic-label-normal)]">
                      약 {store.deliveryTimeMin}분 소요
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-3 bg-[var(--color-atomic-coolNeutral-97)]" />

        {/* Tab bar */}
        {menuGroups.length > 0 && (
          <div className="sticky top-0 z-30 bg-white">
            <div className="flex gap-[6px] overflow-x-auto scrollbar-hide px-4 py-3">
              {menuGroups.map((group, i) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => handleTabClick(i)}
                  className={`shrink-0 px-3 py-[6px] rounded-2xl text-body2 font-medium transition-colors ${
                    activeTab === i
                      ? 'bg-[var(--color-semantic-label-normal)] text-white'
                      : 'bg-white border border-[var(--color-semantic-line-normal-normal)] text-[var(--color-semantic-label-normal)]'
                  }`}
                >
                  {group.groupTabName ?? group.groupName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu sections */}
        {menuGroupsWithItems.map((group, gi) => (
          <section
            key={group.id}
            ref={(el) => {
              sectionRefs.current[gi] = el;
            }}
            className="scroll-mt-[48px]"
          >
            {/* Group header */}
            <div className="px-4 pt-5 pb-1">
              <p className="text-[20px] font-bold text-[var(--color-semantic-label-normal)]">
                {group.groupName}
              </p>
              {group.groupDescription ? (
                <p className="text-body2 text-[var(--color-semantic-label-alternative)] mt-1 line-clamp-2">
                  {group.groupDescription}
                </p>
              ) : null}
            </div>

            {/* Menu items */}
            {group.menus.map((menu, index) => (
              <div key={menu.id}>
                {index > 0 && (
                  <div className="mx-4 border-t border-[var(--color-semantic-line-normal-normal)]" />
                )}
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/stores/${trimmedStoreId}/menu/${menu.id}`)
                  }
                  className="w-full px-4 py-4 flex gap-3 text-left"
                >
                  {/* Left: text content */}
                  <div className="flex-1 min-w-0">
                    {menu.rank != null && (
                      <span className="inline-block mb-1.5 text-caption2 font-medium text-[var(--color-atomic-coolNeutral-50)] bg-[var(--color-atomic-coolNeutral-98)] px-[6px] py-[2px] rounded">
                        인기 {menu.rank}위
                      </span>
                    )}
                    <p className="text-body1 font-bold leading-snug text-[var(--color-semantic-label-normal)] line-clamp-1">
                      {menu.menuName}
                    </p>
                    {menu.menuDescription ? (
                      <p className="text-caption1 text-[var(--color-semantic-label-alternative)] mt-[2px] line-clamp-1">
                        {menu.menuDescription}
                      </p>
                    ) : null}
                    <div className="mt-2 flex items-center gap-[6px]">
                      <span className="text-body1 font-bold text-[var(--color-semantic-label-normal)]">
                        {getMenuDisplayPrice(menu)}
                      </span>
                      {menu.reviewCount > 0 && (
                        <span className="text-caption1 text-[var(--color-semantic-label-alternative)]">
                          리뷰{' '}
                          <span className="font-bold">
                            {menu.reviewCount}개
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: thumbnail + plus button */}
                  <div className="relative w-[100px] h-[100px] shrink-0">
                    <img
                      src={
                        menu.thumbnailUrl ??
                        `https://picsum.photos/seed/menu-${menu.id}/200/200`
                      }
                      alt={menu.menuName}
                      className="w-full h-full object-cover rounded-[6px]"
                    />
                    <span className="absolute bottom-2 right-2 w-5 h-5 bg-white rounded-[4px] flex items-center justify-center shadow-md">
                      <PlusIcon className="size-[16px] [&_path]:fill-[var(--color-atomic-coolNeutral-50)]" />
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </section>
        ))}

        {/* Fallback: flat menus when no groups */}
        {menuGroupsWithItems.length === 0 && (
          <section className="px-4 pt-4">
            <p className="text-body1 font-bold text-[var(--color-semantic-label-normal)]">
              메뉴
            </p>
            {(store?.menus ?? []).length === 0 ? (
              <p className="mt-2 text-body2 text-[var(--color-semantic-label-alternative)]">
                등록된 메뉴가 없습니다.
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-[var(--color-semantic-line-normal-normal)]">
                {(store?.menus ?? []).map((menu, index) => (
                  <li key={`${menu.menuName}-${index}`}>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/stores/${trimmedStoreId}/menu/${menu?.id ?? index + 1}`
                        )
                      }
                      className="w-full py-4 flex items-start justify-between gap-2 text-left"
                    >
                      <div>
                        <p className="text-body1 font-bold text-[var(--color-semantic-label-normal)]">
                          {menu.menuName}
                        </p>
                        {menu.menuDescription && (
                          <p className="text-body3 text-[var(--color-semantic-label-alternative)] mt-0.5">
                            {menu.menuDescription}
                          </p>
                        )}
                        <p className="text-body2 font-bold text-[var(--color-semantic-label-normal)] mt-1.5">
                          {getMenuDisplayPrice(menu)}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      {storeCartItems.length > 0 && (
        <BottomSheet className="pb-3 flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[20px] font-bold text-[var(--color-semantic-label-normal)]">
                {cartTotalAmount.toLocaleString('ko-KR')}원
              </p>
              {store?.minimumOrderAmount && (
                <p className="text-[13px] font-medium text-[var(--color-semantic-label-neutral)] mt-[4px]">
                  최소주문 금액{' '}
                  {(
                    store.minimumOrderAmount?.amount ?? store.minimumOrderAmount
                  ).toLocaleString('ko-KR')}
                  원
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="flex items-center justify-center gap-[10px] w-[169px] h-[48px] bg-[var(--color-atomic-redOrange-80)] text-white rounded-[10px] font-bold text-[16px] shrink-0"
            >
              <span className="w-5 h-5 rounded-full bg-white text-[var(--color-atomic-redOrange-80)] text-[12px] font-bold flex items-center justify-center">
                {cartTotalCount}
              </span>
              장바구니 보기
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}
