const TERMS = [
  { id: 'service', title: '서비스 이용약관', updatedAt: '2026-01-10' },
  { id: 'privacy', title: '개인정보 처리방침', updatedAt: '2026-01-10' },
  {
    id: 'location',
    title: '위치기반 서비스 이용약관',
    updatedAt: '2026-01-10',
  },
  { id: 'marketing', title: '마케팅 정보 수신 동의', updatedAt: '2026-01-10' },
  { id: 'youth', title: '청소년 보호 정책', updatedAt: '2025-12-01' },
];

export default function TermsPage() {
  return (
    <div className="min-h-full bg-white py-4 pb-8">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        약관 및 정책
      </h1>

      <ul className="mt-4 divide-y divide-[var(--color-semantic-line-normal-normal)] border-y border-[var(--color-semantic-line-normal-normal)]">
        {TERMS.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-4">
            <div>
              <p className="text-body1 text-[var(--color-semantic-label-normal)]">
                {item.title}
              </p>
              <p className="mt-1 text-caption1 text-[var(--color-semantic-label-alternative)]">
                개정일 {item.updatedAt}
              </p>
            </div>
            <span className="text-body3 text-[var(--color-semantic-label-alternative)]">
              보기
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-caption1 text-[var(--color-semantic-label-alternative)]">
        본 약관은 데모 목적의 예시 문서이며 실제 법적 효력은 없습니다.
      </p>
    </div>
  );
}
