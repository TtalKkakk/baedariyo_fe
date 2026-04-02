import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createStoreReview } from '@/shared/api';
import BackIcon from '@/shared/assets/icons/header/back.svg?react';

function StarIcon({ filled, size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? 'var(--color-atomic-redOrange-80)' : 'var(--color-atomic-coolNeutral-90)'}
      />
    </svg>
  );
}

const RATING_LABELS = {
  1: '별로예요',
  2: '그저 그래요',
  3: '보통이에요',
  4: '좋아요',
  5: '최고예요!',
};

export default function WriteReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { storePublicId, storeName } = location.state ?? {};

  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(null);
  const [comment, setComment] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      createStoreReview(storePublicId, {
        rating,
        storeReviewComment: comment.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-payments'] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      navigate(-1);
    },
  });

  const displayRating = hovered ?? rating;

  if (!storePublicId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-body1 text-[var(--color-semantic-label-normal)]">
          잘못된 접근입니다.
        </p>
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="h-10 px-5 rounded-xl border border-[var(--color-semantic-line-normal-normal)] text-body2"
        >
          주문 내역으로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0">
        <button type="button" onClick={() => navigate(-1)}>
          <BackIcon className="size-5" />
        </button>
        <p className="text-body1 font-bold text-[var(--color-semantic-label-normal)]">
          리뷰 작성
        </p>
      </div>

      <div className="flex-1 px-4 pt-4 pb-8">
        {/* 가게명 */}
        <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)] text-center">
          {storeName}
        </p>
        <p className="mt-1 text-body2 text-[var(--color-semantic-label-alternative)] text-center">
          주문하신 음식은 어떠셨나요?
        </p>

        {/* 별점 */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(null)}
              >
                <StarIcon filled={star <= displayRating} size={40} />
              </button>
            ))}
          </div>
          <p className="text-[15px] font-semibold text-[var(--color-atomic-redOrange-80)]">
            {RATING_LABELS[displayRating]}
          </p>
        </div>

        {/* 텍스트 */}
        <div className="mt-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 300))}
            placeholder="음식 맛, 배달 속도, 포장 상태 등 솔직한 후기를 남겨주세요."
            className="w-full h-[140px] px-4 py-3 rounded-xl border border-[var(--color-semantic-line-normal-normal)] text-body2 text-[var(--color-semantic-label-normal)] placeholder:text-[var(--color-semantic-label-alternative)] outline-none resize-none"
          />
          <p className="text-right text-[12px] text-[var(--color-semantic-label-alternative)] mt-1">
            {comment.length}/300
          </p>
        </div>

        {/* 에러 */}
        {mutation.isError && (
          <p className="mt-2 text-[13px] text-[var(--color-semantic-status-negative)]">
            리뷰 등록에 실패했습니다. 다시 시도해주세요.
          </p>
        )}

        {/* 제출 버튼 */}
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="w-full mt-6 h-[52px] rounded-xl bg-[var(--color-atomic-redOrange-80)] text-white text-[16px] font-bold disabled:opacity-40"
        >
          {mutation.isPending ? '등록 중...' : '리뷰 등록'}
        </button>
      </div>
    </div>
  );
}
