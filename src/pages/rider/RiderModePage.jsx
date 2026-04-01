import { useNavigate } from 'react-router-dom';

export default function RiderModePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[var(--color-atomic-coolNeutral-97)] min-h-full px-4 py-6">
      <div className="rounded-xl bg-white p-5">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          운행 모드 선택
        </p>
        <p className="mt-2 text-body2 text-[var(--color-semantic-label-alternative)]">
          운행 시작 전 원하는 모드를 선택하는 화면입니다.
        </p>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            className="w-full h-11 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body2 font-semibold"
          >
            일반 배달 시작
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full h-11 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 font-semibold"
          >
            이전으로
          </button>
        </div>
      </div>
    </div>
  );
}
