import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { getStoreDetail } from '@/shared/api';

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

  const {
    data: store,
    isLoading,
    isFetching,
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
      <div className="px-4 py-6">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          잘못된 가게 ID입니다.
        </p>
        <p className="mt-2 text-body2 text-[var(--color-semantic-label-alternative)]">
          <code>/stores/{'{UUID}'}</code> 형식으로 접속해 주세요.
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
    <div className="px-4 py-4 pb-8 bg-white">
      <p className="text-xs text-[var(--color-semantic-label-alternative)]">
        {isFetching ? '최신 데이터 동기화 중...' : '백엔드 데이터 동기화 완료'}
      </p>

      <div className="mt-2">
        <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
          {store?.storeName ?? '가게 이름 없음'}
        </h1>
        <p className="mt-1 text-body2 text-[var(--color-semantic-label-alternative)]">
          평점 {store?.totalRating ?? 0} · 리뷰 {store?.reviewCount ?? 0}개
        </p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => navigate(`/stores/${trimmedStoreId}/reviews`)}
            className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body3 font-medium text-[var(--color-semantic-label-normal)]"
          >
            리뷰 전체 보기
          </button>
          <button
            type="button"
            onClick={() => navigate(`/stores/${trimmedStoreId}/info`)}
            className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body3 font-medium text-[var(--color-semantic-label-normal)]"
          >
            가게 정보
          </button>
        </div>
      </div>

      {store?.thumbnailUrl ? (
        <img
          src={store.thumbnailUrl}
          alt={store?.storeName ?? 'store-thumbnail'}
          className="mt-4 w-full h-48 object-cover rounded-xl border border-[var(--color-semantic-line-normal-normal)]"
        />
      ) : null}

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-[var(--color-semantic-label-normal)]">
          메뉴
        </h2>
        {menus.length === 0 ? (
          <p className="mt-2 text-body2 text-[var(--color-semantic-label-alternative)]">
            등록된 메뉴가 없습니다.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-[var(--color-semantic-line-normal-normal)] rounded-xl border border-[var(--color-semantic-line-normal-normal)]">
            {menus.map((menu, index) => (
              <li
                key={`${menu.menuName ?? 'menu'}-${index}`}
                className="px-3 py-3 bg-white"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-body1 font-medium text-[var(--color-semantic-label-normal)]">
                    {menu.menuName ?? '이름 없음'}
                  </p>
                  <span className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
                    {formatPrice(menu.price)}
                  </span>
                </div>
                {menu.menuDescription ? (
                  <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
                    {menu.menuDescription}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-[var(--color-semantic-label-normal)]">
          최근 사진 리뷰
        </h2>
        {recentPhotoReviews.length === 0 ? (
          <p className="mt-2 text-body2 text-[var(--color-semantic-label-alternative)]">
            최근 사진 리뷰가 없습니다.
          </p>
        ) : (
          <ul className="mt-2 space-y-3">
            {recentPhotoReviews.map((review, index) => (
              <li
                key={`${review.thumbnailImages ?? 'review'}-${index}`}
                className="p-3 rounded-xl border border-[var(--color-semantic-line-normal-normal)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-body2 font-medium text-[var(--color-semantic-label-normal)]">
                    {review.storeReviewComment ?? '리뷰 내용 없음'}
                  </p>
                  <span className="text-body3 text-[var(--color-semantic-label-alternative)]">
                    ★ {review.rating ?? 0}
                  </span>
                </div>
                {review.thumbnailImages ? (
                  <img
                    src={review.thumbnailImages}
                    alt="리뷰 사진"
                    className="mt-2 w-full h-40 object-cover rounded-lg"
                  />
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
