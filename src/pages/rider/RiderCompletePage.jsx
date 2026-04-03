import { useNavigate } from 'react-router-dom';

export default function RiderCompletePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[var(--color-atomic-coolNeutral-97)] min-h-full px-4 py-6">
      <div className="rounded-xl bg-white p-5">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          배달 완료
        </p>
        <p className="mt-2 text-body2 text-[var(--color-semantic-label-alternative)]">
          고객 전달 후 사진을 등록하는 단계입니다.
        </p>

        <button
          type="button"
          onClick={() => navigate('/rider')}
          className="mt-4 w-full h-11 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body2 font-semibold"
        >
          홈으로 이동
        </button>
      </div>
    </div>
  );
}
