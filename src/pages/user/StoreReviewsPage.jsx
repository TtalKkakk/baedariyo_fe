import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { getStoreReviews } from '@/shared/api';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return UUID_REGEX.test(value);
}

function formatDateTime(value) {
  if (!value) return '-';

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return parsedDate.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '리뷰 목록을 불러오지 못했습니다.'
  );
}

function ReviewItem({ review, onOpenDetail }) {
  const images = Array.isArray(review?.storeReviewImages)
    ? review.storeReviewImages
    : Array.isArray(review?.StoreReviewImages)
      ? review.StoreReviewImages
      : [];
  const reviewPublicId = review?.publicId;

  return (
    <li className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
          ★ {review?.rating ?? 0}
        </p>
        <p className="text-caption1 text-[var(--color-semantic-label-alternative)]">
          {formatDateTime(review?.createdAt)}
        </p>
      </div>

      <p className="mt-2 text-body3 text-[var(--color-semantic-label-normal)]">
        {review?.storeReviewComment ?? '작성된 코멘트가 없습니다.'}
      </p>

      {images.length > 0 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none">
          {images.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt="리뷰 이미지"
              className="w-24 h-24 rounded-lg object-cover shrink-0 border border-[var(--color-semantic-line-normal-normal)]"
            />
          ))}
        </div>
      ) : null}

      {reviewPublicId ? (
        <button
          type="button"
          onClick={() => onOpenDetail(reviewPublicId)}
          className="mt-3 h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body3 font-medium text-[var(--color-semantic-label-normal)]"
        >
          리뷰 상세 보기
        </button>
      ) : null}
    </li>
  );
}

export default function StoreReviewsPage() {
  const navigate = useNavigate();
  const { storeId = '' } = useParams();
  const trimmedStoreId = storeId.trim();
  const canFetch = isUuid(trimmedStoreId);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['store-reviews', trimmedStoreId],
    queryFn: () => getStoreReviews(trimmedStoreId),
    enabled: canFetch,
    retry: 1,
  });

  const reviews = Array.isArray(data) ? data : [];
  const openReviewDetail = (reviewPublicId) => {
    navigate(`/reviews/${reviewPublicId}`);
  };
  const averageRating =
    reviews.length === 0
      ? 0
      : (
          reviews.reduce((acc, review) => acc + (review?.rating ?? 0), 0) /
          reviews.length
        ).toFixed(1);
  const storeName = reviews[0]?.storeName;

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
          리뷰를 불러오는 중입니다...
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

  return (
    <div className="min-h-full bg-white px-4 py-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
          {storeName ? `${storeName} 리뷰` : '가게 리뷰'}
        </h1>
        <p className="text-caption1 text-[var(--color-semantic-label-alternative)]">
          {isFetching ? '동기화 중...' : `${reviews.length}개`}
        </p>
      </div>

      <div className="mt-3 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] px-3 py-2">
        <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
          평균 평점
        </p>
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          ★ {averageRating}
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] p-6 text-center">
          <p className="text-body1 font-medium text-[var(--color-semantic-label-normal)]">
            아직 등록된 리뷰가 없습니다.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {reviews.map((review, index) => (
            <ReviewItem
              key={`${review?.publicId ?? review?.createdAt ?? 'review'}-${index}`}
              review={review}
              onOpenDetail={openReviewDetail}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
