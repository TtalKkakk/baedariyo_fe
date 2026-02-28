import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { getReviewDetail } from '@/shared/api';

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
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getReviewImages(review) {
  if (Array.isArray(review?.orderMenuImages)) return review.orderMenuImages;
  if (Array.isArray(review?.storeReviewImages)) return review.storeReviewImages;
  if (Array.isArray(review?.storeReviewImages?.images))
    return review.storeReviewImages.images;
  if (Array.isArray(review?.StoreReviewImages)) return review.StoreReviewImages;
  return [];
}

function getReviewComment(review) {
  if (typeof review?.storeReviewComment === 'string')
    return review.storeReviewComment;
  if (typeof review?.storeReviewComment?.comment === 'string')
    return review.storeReviewComment.comment;
  return '';
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '리뷰 상세를 불러오지 못했습니다.'
  );
}

export default function ReviewDetailPage() {
  const navigate = useNavigate();
  const { reviewId = '' } = useParams();
  const trimmedReviewId = reviewId.trim();
  const canFetch = isUuid(trimmedReviewId);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['review-detail', trimmedReviewId],
    queryFn: () => getReviewDetail(trimmedReviewId),
    enabled: canFetch,
    retry: 1,
  });

  if (!canFetch) {
    return (
      <div className="px-4 py-6">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          잘못된 리뷰 ID입니다.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <p className="text-body1 text-[var(--color-semantic-label-normal)]">
          리뷰 상세를 불러오는 중입니다...
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

  const review = data ?? null;
  const images = getReviewImages(review);
  const comment = getReviewComment(review);
  const reviewPublicId = review?.publicId ?? trimmedReviewId;
  const storePublicId = review?.storePublicId;

  return (
    <div className="min-h-full bg-white px-4 py-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
          리뷰 상세
        </h1>
        {storePublicId ? (
          <button
            type="button"
            onClick={() => navigate(`/stores/${storePublicId}`)}
            className="h-8 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body3"
          >
            가게 보기
          </button>
        ) : null}
      </div>

      <section className="mt-3 rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4">
        <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
          리뷰 ID
        </p>
        <p className="mt-1 break-all text-body2 text-[var(--color-semantic-label-normal)]">
          {reviewPublicId}
        </p>
        <p className="mt-2 text-body3 text-[var(--color-semantic-label-alternative)]">
          평점
        </p>
        <p className="mt-1 text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          ★ {review?.rating ?? 0}
        </p>
        <p className="mt-2 text-body3 text-[var(--color-semantic-label-alternative)]">
          작성일
        </p>
        <p className="mt-1 text-body2 text-[var(--color-semantic-label-normal)]">
          {formatDateTime(review?.createdAt)}
        </p>
      </section>

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4">
        <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          코멘트
        </h2>
        <p className="mt-2 text-body3 text-[var(--color-semantic-label-normal)]">
          {comment || '작성된 코멘트가 없습니다.'}
        </p>
      </section>

      {images.length > 0 ? (
        <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4">
          <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            리뷰 이미지
          </h2>
          <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-none">
            {images.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt="리뷰 이미지"
                className="w-24 h-24 rounded-lg object-cover shrink-0 border border-[var(--color-semantic-line-normal-normal)]"
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
