import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { getStoreDetail } from '@/shared/api';
import ArrowIcon from '@/shared/assets/icons/header/arrow.svg?react';
import HeartIcon from '@/shared/assets/icons/store/heart.svg?react';
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
  const sectionRefs = useRef([]);

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

  const menuGroups = Array.isArray(store?.menuGroups)
    ? store.menuGroups.filter((g) => g.menus?.length > 0)
    : [];

  function handleTabClick(index) {
    setActiveTab(index);
    sectionRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  return (
    <div className="bg-white min-h-full pb-8 -mx-4 -mt-2">
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
          <h1 className="flex-1 text-h6 font-bold leading-snug text-[var(--color-semantic-label-normal)]">
            {store?.storeName ?? '가게 이름 없음'}
          </h1>
          <div className="flex items-center gap-4 mt-0.5 text-[var(--color-semantic-label-normal)]">
            <button type="button" aria-label="공유">
              <ShareIcon className="size-5" />
            </button>
            <button type="button" aria-label="찜하기">
              <HeartIcon className="size-5" />
            </button>
          </div>
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
          <ArrowIcon className="size-4 -rotate-90 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
        </button>

        {/* Info rows */}
        <div className="mt-3 space-y-[6px]">
          <div className="flex gap-4">
            <span className="w-14 text-body3 text-[var(--color-semantic-label-alternative)]">
              최소주문
            </span>
            <span className="text-body3 text-[var(--color-semantic-label-normal)]">
              {formatPrice(store?.minimumOrderAmount)}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-14 text-body3 text-[var(--color-semantic-label-alternative)]">
              배달비
            </span>
            <span className="text-body3 text-[var(--color-semantic-label-normal)]">
              {formatPrice(store?.deliveryFee)}
            </span>
            {store?.deliveryTimeMin && (
              <div className="flex items-center gap-1">
                <TimeIcon className="size-4" />
                <span className="text-body3 text-[var(--color-semantic-label-normal)]">
                  약 {store.deliveryTimeMin}분 소요
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gray separator */}
      <div className="h-2 bg-[var(--color-semantic-background-alternative)]" />

      {/* Tab bar */}
      {menuGroups.length > 0 && (
        <div className="sticky top-0 z-10 bg-white border-b border-[var(--color-semantic-line-normal-normal)]">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
            {menuGroups.map((group, i) => (
              <button
                key={group.id}
                type="button"
                onClick={() => handleTabClick(i)}
                className={`shrink-0 px-4 py-[6px] rounded-full text-body3 font-medium transition-colors ${
                  activeTab === i
                    ? 'bg-[var(--color-semantic-label-normal)] text-white'
                    : 'bg-[var(--color-semantic-background-alternative)] text-[var(--color-semantic-label-alternative)]'
                }`}
              >
                {group.groupTabName ?? group.groupName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu sections */}
      {menuGroups.map((group, gi) => (
        <section
          key={group.id}
          ref={(el) => {
            sectionRefs.current[gi] = el;
          }}
          className="scroll-mt-[48px]"
        >
          {/* Group header */}
          <div className="px-4 pt-5 pb-1">
            <h2 className="text-body1 font-bold text-[var(--color-semantic-label-normal)]">
              {group.groupName}
            </h2>
            {group.groupDescription ? (
              <p className="text-caption1 text-[var(--color-semantic-label-alternative)] mt-0.5">
                {group.groupDescription}
              </p>
            ) : null}
          </div>

          {/* Menu items */}
          {group.menus.map((menu) => (
            <button
              key={menu.id}
              type="button"
              onClick={() =>
                navigate(`/stores/${trimmedStoreId}/menu/${menu.id}`)
              }
              className="w-full px-4 py-4 border-t border-[var(--color-semantic-line-normal-normal)] flex gap-3 text-left"
            >
              {/* Left: text content */}
              <div className="flex-1 min-w-0">
                {menu.rank != null && (
                  <span className="inline-block mb-1.5 text-caption2 text-[var(--color-semantic-label-alternative)] bg-[var(--color-semantic-background-alternative)] px-[6px] py-[2px] rounded">
                    인기 {menu.rank}위
                  </span>
                )}
                <p className="text-body1 font-bold leading-snug text-[var(--color-semantic-label-normal)]">
                  {menu.menuName}
                </p>
                {menu.menuDescription ? (
                  <p className="text-body3 text-[var(--color-semantic-label-alternative)] mt-0.5 line-clamp-1">
                    {menu.menuDescription}
                  </p>
                ) : null}
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-body2 font-bold text-[var(--color-semantic-label-normal)]">
                    {formatPrice(menu.price)}
                  </span>
                  {menu.reviewCount > 0 && (
                    <span className="text-caption1 text-[var(--color-semantic-label-alternative)]">
                      리뷰 {menu.reviewCount}개
                    </span>
                  )}
                </div>
              </div>

              {/* Right: thumbnail + plus button */}
              <div className="relative w-[88px] h-[88px] shrink-0">
                <img
                  src={
                    menu.thumbnailUrl ??
                    `https://picsum.photos/seed/menu-${menu.id}/200/200`
                  }
                  alt={menu.menuName}
                  className="w-full h-full object-cover rounded-xl"
                />
                <span className="absolute bottom-1.5 right-1.5 w-7 h-7 bg-white rounded-xl flex items-center justify-center text-h5 font-light leading-none shadow-md">
                  +
                </span>
              </div>
            </button>
          ))}
        </section>
      ))}

      {/* Fallback: flat menus when no groups */}
      {menuGroups.length === 0 && (
        <section className="px-4 pt-4">
          <h2 className="text-body1 font-bold text-[var(--color-semantic-label-normal)]">
            메뉴
          </h2>
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
                        {formatPrice(menu.price)}
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
  );
}
