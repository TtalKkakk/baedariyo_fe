import { useNavigate } from 'react-router-dom';

const FAQ = [
  {
    q: '배달이 늦어지고 있어요.',
    a: '주문 상세 페이지의 "현황 보기"에서 실시간 위치를 확인할 수 있어요. 20분 이상 지연 시 1:1 문의를 남겨주세요.',
  },
  {
    q: '결제 수단을 어떻게 바꾸나요?',
    a: '마이페이지 > 결제 수단 관리에서 카드를 추가하거나 기본 카드를 변경할 수 있습니다.',
  },
  {
    q: '쿠폰은 중복 사용 가능한가요?',
    a: '주문 1건에 1개의 쿠폰만 사용 가능합니다. 쿠폰함에서 적용 가능 여부를 확인해주세요.',
  },
  {
    q: '주문을 취소하고 싶어요.',
    a: '가게에서 조리를 시작하기 전까지만 취소 가능합니다. 이후에는 가게에 직접 연락해주세요.',
  },
];

export default function SupportPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-white py-4 pb-8">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        고객센터
      </h1>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => navigate('/mypage/inquiries')}
          className="h-24 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] text-body1 font-semibold text-[var(--color-semantic-label-normal)]"
        >
          1:1 문의
          <p className="mt-1 text-caption1 font-normal text-[var(--color-semantic-label-alternative)]">
            평균 응답 2시간
          </p>
        </button>
        <a
          href="tel:1588-0000"
          className="flex flex-col items-center justify-center h-24 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] text-body1 font-semibold text-[var(--color-semantic-label-normal)]"
        >
          전화 문의
          <span className="mt-1 text-caption1 font-normal text-[var(--color-semantic-label-alternative)]">
            1588-0000 (09–22시)
          </span>
        </a>
      </div>

      <h2 className="mt-8 text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
        자주 묻는 질문
      </h2>
      <ul className="mt-3 space-y-3">
        {FAQ.map((item) => (
          <li
            key={item.q}
            className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4"
          >
            <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
              Q. {item.q}
            </p>
            <p className="mt-2 text-body3 text-[var(--color-semantic-label-alternative)]">
              {item.a}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
