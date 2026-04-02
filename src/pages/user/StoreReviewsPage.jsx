import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { getStoreReviews } from '@/shared/api';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return UUID_REGEX.test(value);
}

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function StarBar({ count, total, percent }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-2 text-[12px] text-[var(--color-semantic-label-alternative)] text-right">
        {count}
      </span>
      <div className="flex-1 h-[6px] bg-[var(--color-semantic-line-normal-normal)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-atomic-yellow-60)] rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-5 text-[12px] text-[var(--color-semantic-label-alternative)]">
        {total}
      </span>
    </div>
  );
}

function ReviewCard({ review }) {
  const images = Array.isArray(review?.storeReviewImages)
    ? review.storeReviewImages
    : Array.isArray(review?.StoreReviewImages)
      ? review.StoreReviewImages
      : [];

  return (
    <div className="border-b border-[var(--color-semantic-line-normal-normal)] py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[2px]">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-[16px] ${
                star <= (review?.rating ?? 0)
                  ? 'text-[var(--color-atomic-yellow-60)]'
                  : 'text-[var(--color-semantic-line-normal-normal)]'
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-[12px] text-[var(--color-semantic-label-alternative)]">
          {formatDate(review?.createdAt)}
        </span>
      </div>

      {review?.storeReviewComment ? (
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-semantic-label-normal)]">
          {review.storeReviewComment}
        </p>
      ) : null}

      {images.length > 0 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none">
          {images.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt="리뷰 이미지"
              className="w-[80px] h-[80px] shrink-0 rounded-xl object-cover border border-[var(--color-semantic-line-normal-normal)]"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function StoreReviewsPage() {
  const navigate = useNavigate();
  const { storeId = '' } = useParams();
  const trimmedStoreId = storeId.trim();
  const canFetch = isUuid(trimmedStoreId);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['store-reviews', trimmedStoreId],
    queryFn: () => getStoreReviews(trimmedStoreId),
    enabled: canFetch,
    retry: 1,
  });

  const reviews = Array.isArray(data) ? data : [];

  const averageRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((acc, r) => acc + (r?.rating ?? 0), 0) / reviews.length;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r?.rating ?? 0) === star).length,
  }));

  if (!canFetch) {
    return (
      <div className="py-6">
        <p className="text-[14px] text-[var(--color-semantic-label-alternative)]">
          잘못된 가게 ID입니다.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-[14px] text-[var(--color-semantic-label-alternative)]">
          불러오는 중...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-6">
        <p className="text-[14px] text-[var(--color-semantic-status-cautionary)]">
          {error?.response?.data?.message ?? '리뷰를 불러오지 못했습니다.'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 h-9 px-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] text-[13px]"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white pb-8">
      {/* 평점 요약 */}
      <div className="py-4 flex items-center gap-6 border-b border-[var(--color-semantic-line-normal-normal)]">
        {/* 평균 점수 */}
        <div className="flex flex-col items-center shrink-0">
          <p className="text-[40px] font-bold text-[var(--color-semantic-label-normal)] leading-none">
            {averageRating.toFixed(1)}
          </p>
          <div className="flex items-center gap-[2px] mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-[14px] ${
                  star <= Math.round(averageRating)
                    ? 'text-[var(--color-atomic-yellow-60)]'
                    : 'text-[var(--color-semantic-line-normal-normal)]'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-[12px] text-[var(--color-semantic-label-alternative)] mt-1">
            {reviews.length}개 리뷰
          </p>
        </div>

        {/* 별점 바 */}
        <div className="flex-1 space-y-[6px]">
          {ratingCounts.map(({ star, count }) => (
            <StarBar
              key={star}
              count={star}
              total={count}
              percent={reviews.length > 0 ? (count / reviews.length) * 100 : 0}
            />
          ))}
        </div>
      </div>

      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-[14px] text-[var(--color-semantic-label-alternative)]">
            아직 등록된 리뷰가 없습니다.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 h-9 px-5 rounded-xl border border-[var(--color-semantic-line-normal-normal)] text-[13px] text-[var(--color-semantic-label-normal)]"
          >
            돌아가기
          </button>
        </div>
      ) : (
        <div>
          {reviews.map((review, index) => (
            <ReviewCard
              key={`${review?.publicId ?? review?.createdAt ?? 'review'}-${index}`}
              review={review}
            />
          ))}
        </div>
      )}
    </div>
  );
}
