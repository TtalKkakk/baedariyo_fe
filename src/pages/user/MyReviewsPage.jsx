import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { deleteMyReview, getMyReviews } from '@/shared/api';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { Toast } from '@/shared/ui/Toast';

function formatDate(value) {
  if (!value) return '-';
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;
  return parsedDate
    .toLocaleDateString('ko-KR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\s/g, '');
}

function StarRating({ rating }) {
  return (
    <span className="text-caption1 text-[var(--color-atomic-yellow-60)]">
      {'★'.repeat(Math.round(rating))}
      {'☆'.repeat(5 - Math.round(rating))}
    </span>
  );
}

function ReviewCard({ review, onDelete }) {
  const images = Array.isArray(review?.orderMenuImages)
    ? review.orderMenuImages
    : [];

  return (
    <div className="border-b border-[var(--color-semantic-line-normal-normal)] pb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
              {review?.storeName ?? '가게명 없음'}
            </p>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 5l5 5-5 5"
                stroke="var(--color-semantic-label-alternative)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <StarRating rating={review?.rating ?? 0} />
            <span className="text-caption1 text-[var(--color-semantic-label-alternative)]">
              {formatDate(review?.createdAt)}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(review?.publicStoreReviewId)}
          className="text-caption1 text-[var(--color-semantic-label-alternative)] underline"
        >
          리뷰 삭제
        </button>
      </div>

      <p className="mt-3 text-body3 leading-relaxed text-[var(--color-semantic-label-normal)]">
        {review?.storeReviewComment ?? ''}
      </p>

      {images.length > 0 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none">
          {images.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt="리뷰 이미지"
              className="h-24 w-24 shrink-0 rounded-lg border border-[var(--color-semantic-line-normal-normal)] object-cover"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function MyReviewsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: getMyReviews,
    retry: 1,
  });

  const reviews = Array.isArray(data) ? data : [];

  const deleteMutation = useMutation({
    mutationFn: deleteMyReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      setDeleteTarget(null);
      setToast({ visible: true, message: '리뷰가 삭제 되었습니다.' });
    },
  });

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-white">
        <p className="text-body2 text-[var(--color-semantic-label-alternative)]">
          불러오는 중...
        </p>
      </div>
    );
  }

  if (isError) {
    const isUnauthorized = error?.response?.status === 401;
    return (
      <div className="min-h-full bg-white py-6">
        <p className="text-body2 text-[var(--color-semantic-status-cautionary)]">
          {error?.response?.data?.message ??
            error?.message ??
            '리뷰를 불러오지 못했습니다.'}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="h-9 rounded-md border border-[var(--color-semantic-line-normal-normal)] px-3 text-body3"
          >
            다시 시도
          </button>
          {isUnauthorized ? (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="h-9 rounded-md border border-[var(--color-semantic-line-normal-normal)] px-3 text-body3"
            >
              로그인
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white pb-4">
      <p className="py-3 text-body1 font-bold text-[var(--color-semantic-label-normal)]">
        내가 쓴 리뷰{'  '}
        <span className="text-body1 font-bold">{reviews.length}개</span>
      </p>

      {/* Filters */}
      <div className="flex gap-2 py-2">
        <button
          type="button"
          className="flex items-center gap-1 rounded-full border border-[var(--color-semantic-line-normal-normal)] px-3 py-1.5 text-caption1 text-[var(--color-semantic-label-normal)]"
        >
          주소
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 4.5l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="flex items-center gap-1 rounded-full border border-[var(--color-semantic-line-normal-normal)] px-3 py-1.5 text-caption1 text-[var(--color-semantic-label-normal)]"
        >
          조회 기간
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 4.5l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="mt-8 py-6 text-center">
          <p className="text-body2 text-[var(--color-semantic-label-alternative)]">
            아직 작성한 리뷰가 없습니다.
          </p>
        </div>
      ) : (
        <div className="mt-2 space-y-4">
          {reviews.map((review, index) => (
            <ReviewCard
              key={`${review?.publicStoreReviewId ?? 'review'}-${index}`}
              review={review}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="리뷰를 삭제 하시겠어요?"
        description="리뷰를 삭제하면 재작성이 불가합니다."
        confirmLabel="리뷰 삭제"
        cancelLabel="취소"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDestructive
      />

      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast({ visible: false, message: '' })}
      />
    </div>
  );
}
