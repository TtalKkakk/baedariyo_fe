import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { getMyReviews } from '@/shared/api';

function formatDate(value) {
  if (!value) return '-';

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return parsedDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '내 리뷰를 불러오지 못했습니다.'
  );
}

function ReviewCard({ review, onOpenStore }) {
  const images = Array.isArray(review?.orderMenuImages)
    ? review.orderMenuImages
    : [];

  return (
    <li className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          {review?.storeName ?? '가게명 없음'}
        </p>
        <p className="text-caption1 text-[var(--color-semantic-label-alternative)]">
          {formatDate(review?.createdAt)}
        </p>
      </div>

      <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
        평점 ★ {review?.rating ?? 0}
      </p>

      <p className="mt-2 text-body3 text-[var(--color-semantic-label-normal)]">
        {review?.storeReviewComment ?? '작성한 리뷰 코멘트가 없습니다.'}
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

      {review?.storePublicId ? (
        <button
          type="button"
          onClick={() => onOpenStore(review.storePublicId)}
          className="mt-3 h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body3 font-medium text-[var(--color-semantic-label-normal)]"
        >
          가게 상세 보기
        </button>
      ) : null}
    </li>
  );
}

export default function MyReviewsPage() {
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: getMyReviews,
    retry: 1,
  });

  const reviews = Array.isArray(data) ? data : [];

  const openStoreDetail = (storePublicId) => {
    navigate(`/stores/${storePublicId}`);
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <p className="text-body1 text-[var(--color-semantic-label-normal)]">
          내 리뷰를 불러오는 중입니다...
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
          내 리뷰
        </h1>
        <p className="text-caption1 text-[var(--color-semantic-label-alternative)]">
          {isFetching ? '동기화 중...' : `${reviews.length}개`}
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] p-6 text-center">
          <p className="text-body1 font-medium text-[var(--color-semantic-label-normal)]">
            아직 작성한 리뷰가 없습니다.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {reviews.map((review, index) => (
            <ReviewCard
              key={`${review?.publicStoreReviewId ?? review?.createdAt ?? 'review'}-${index}`}
              review={review}
              onOpenStore={openStoreDetail}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
