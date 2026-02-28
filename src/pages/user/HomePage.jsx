import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchIcon from '@/shared/assets/icons/header/search.svg?react';
import { CategoryList } from '@/widgets';

export default function HomePage() {
  const navigate = useNavigate();
  const [storeIdInput, setStoreIdInput] = useState(
    import.meta.env.VITE_DEFAULT_STORE_PUBLIC_ID ?? ''
  );

  const moveToStoreDetail = () => {
    const trimmedStoreId = storeIdInput.trim();
    if (!trimmedStoreId) return;
    navigate(`/stores/${trimmedStoreId}`);
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-white to-[var(--color-atomic-redOrange-99)]">
      <div className="px-4 pt-2 pb-4">
        <button
          onClick={() => navigate('/search')}
          className="w-full flex items-center gap-3 h-10 pl-2 pr-4 bg-white border border-[var(--color-semantic-line-normal-normal)] rounded-lg"
        >
          <SearchIcon className="size-5 [&_path]:fill-[var(--color-atomic-redOrange-80)] shrink-0" />
          <span className="text-body1 font-normal text-[var(--color-semantic-label-alternative)]">
            퇴근 하고 나서 치킨에 맥주?
          </span>
        </button>
      </div>
      <div className="px-4 py-2">
        <CategoryList />
      </div>

      {import.meta.env.DEV ? (
        <div className="px-4 py-4">
          <section className="p-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white">
            <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
              백엔드 연동 테스트
            </h2>
            <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
              가게 UUID를 넣고 상세 화면에서 실데이터를 확인하세요.
            </p>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={storeIdInput}
                onChange={(event) => setStoreIdInput(event.target.value)}
                placeholder="storePublicId (UUID)"
                className="h-10 flex-1 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
              />
              <button
                type="button"
                onClick={moveToStoreDetail}
                disabled={!storeIdInput.trim()}
                className="h-10 px-4 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body2 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                열기
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
