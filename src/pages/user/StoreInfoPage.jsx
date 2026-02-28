import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { getStoreDetail } from '@/shared/api';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return UUID_REGEX.test(value);
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '가게 정보를 불러오지 못했습니다.'
  );
}

export default function StoreInfoPage() {
  const navigate = useNavigate();
  const { storeId = '' } = useParams();
  const trimmedStoreId = storeId.trim();
  const canFetch = isUuid(trimmedStoreId);

  const {
    data: store,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['store-info', trimmedStoreId],
    queryFn: () => getStoreDetail(trimmedStoreId),
    enabled: canFetch,
    retry: 1,
  });

  if (!canFetch) {
    return (
      <div className="px-4 py-6">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          잘못된 가게 ID입니다.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <p className="text-body1 text-[var(--color-semantic-label-normal)]">
          가게 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (isError) {
    const isUnauthorized = error?.response?.status === 401;

    return (
      <div className="px-4 py-6">
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
          {isUnauthorized ? (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
            >
              로그인하러 가기
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const menus = Array.isArray(store?.menus) ? store.menus : [];
  const recentPhotoReviews = Array.isArray(store?.recentPhotoReviews)
    ? store.recentPhotoReviews
    : [];

  return (
    <div className="min-h-full bg-white px-4 py-4 pb-8">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        가게 정보
      </h1>

      <section className="mt-3 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] p-4">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          {store?.storeName ?? '-'}
        </p>
        <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
          가게 ID: {store?.storePublicId ?? '-'}
        </p>
        <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
          평점: {store?.totalRating ?? 0}
        </p>
        <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
          리뷰 수: {store?.reviewCount ?? 0}
        </p>
      </section>

      {store?.thumbnailUrl ? (
        <section className="mt-4">
          <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            대표 이미지
          </h2>
          <img
            src={store.thumbnailUrl}
            alt={store?.storeName ?? 'store-thumbnail'}
            className="mt-2 w-full h-48 object-cover rounded-xl border border-[var(--color-semantic-line-normal-normal)]"
          />
        </section>
      ) : null}

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4">
        <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          메뉴 현황
        </h2>
        <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
          등록 메뉴: {menus.length}개
        </p>
      </section>

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4">
        <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          최근 리뷰 사진
        </h2>
        {recentPhotoReviews.length === 0 ? (
          <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
            최근 리뷰 사진이 없습니다.
          </p>
        ) : (
          <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-none">
            {recentPhotoReviews.map((review, index) => (
              <img
                key={`${review?.thumbnailImages ?? 'image'}-${index}`}
                src={review?.thumbnailImages}
                alt="최근 리뷰 사진"
                className="w-24 h-24 rounded-lg object-cover shrink-0 border border-[var(--color-semantic-line-normal-normal)]"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
