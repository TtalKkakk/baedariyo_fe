import { useNavigate } from 'react-router-dom';

export default function RiderVerifyPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[var(--color-atomic-coolNeutral-97)] min-h-full px-4 py-6">
      <div className="rounded-xl bg-white p-5">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          본인 확인
        </p>
        <p className="mt-2 text-body2 text-[var(--color-semantic-label-alternative)]">
          신분증 확인 또는 고객 서명을 받는 단계입니다.
        </p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 w-full h-11 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 font-semibold"
        >
          이전으로
        </button>
      </div>
    </div>
  );
}
