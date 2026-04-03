import { useNavigate } from 'react-router-dom';

export default function RiderTrainingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[var(--color-atomic-coolNeutral-97)] min-h-full px-4 py-6">
      <div className="rounded-xl bg-white p-5">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          교육 프로세스
        </p>
        <p className="mt-2 text-body2 text-[var(--color-semantic-label-alternative)]">
          라이더 이용 전 기본 교육을 안내하는 화면입니다.
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
