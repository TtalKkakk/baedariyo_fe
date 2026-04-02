import { useState } from 'react';
import { Toast } from '@/shared/ui/Toast';

const CATEGORIES = ['주문/결제', '배달', '가게/메뉴', '계정', '기타'];

export default function InquiryPage() {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category) {
      setToast({ visible: true, message: '문의 유형을 선택해주세요.' });
      return;
    }
    if (!title.trim()) {
      setToast({ visible: true, message: '제목을 입력해주세요.' });
      return;
    }
    if (content.trim().length < 10) {
      setToast({ visible: true, message: '내용을 10자 이상 입력해주세요.' });
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full bg-white gap-3 pb-16">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-atomic-redOrange-10)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="var(--color-atomic-redOrange-80)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)]">
          문의가 접수되었습니다
        </p>
        <p className="text-[13px] text-[var(--color-semantic-label-alternative)] text-center leading-relaxed">
          평일 09:00~18:00 내에 답변 드리겠습니다.{'\n'}
          빠른 처리를 위해 노력하겠습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white pb-10">
      <p className="py-3 text-[13px] text-[var(--color-semantic-label-alternative)]">
        평일 09:00~18:00 운영 · 보통 1~2일 내 답변
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 문의 유형 */}
        <div>
          <p className="text-[13px] font-semibold text-[var(--color-semantic-label-normal)] mb-2">
            문의 유형
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`h-8 px-3 rounded-full text-[13px] border transition-colors ${
                  category === c
                    ? 'bg-[var(--color-atomic-redOrange-80)] border-[var(--color-atomic-redOrange-80)] text-white font-medium'
                    : 'border-[var(--color-semantic-line-normal-normal)] text-[var(--color-semantic-label-normal)]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div>
          <p className="text-[13px] font-semibold text-[var(--color-semantic-label-normal)] mb-2">
            제목
          </p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 50))}
            placeholder="문의 제목을 입력해주세요"
            className="w-full h-11 px-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] text-[14px] text-[var(--color-semantic-label-normal)] placeholder:text-[var(--color-semantic-label-alternative)] outline-none"
          />
          <p className="text-right text-[12px] text-[var(--color-semantic-label-alternative)] mt-1">
            {title.length}/50
          </p>
        </div>

        {/* 내용 */}
        <div>
          <p className="text-[13px] font-semibold text-[var(--color-semantic-label-normal)] mb-2">
            내용
          </p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 500))}
            placeholder="문의 내용을 자세히 입력해주세요 (최소 10자)"
            className="w-full h-[160px] px-4 py-3 rounded-xl border border-[var(--color-semantic-line-normal-normal)] text-[14px] text-[var(--color-semantic-label-normal)] placeholder:text-[var(--color-semantic-label-alternative)] outline-none resize-none"
          />
          <p className="text-right text-[12px] text-[var(--color-semantic-label-alternative)] mt-1">
            {content.length}/500
          </p>
        </div>

        <button
          type="submit"
          className="w-full h-[52px] rounded-xl bg-[var(--color-atomic-redOrange-80)] text-white text-[16px] font-bold"
        >
          문의 접수
        </button>
      </form>

      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast({ visible: false, message: '' })}
      />
    </div>
  );
}
