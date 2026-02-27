import { useNavigate } from 'react-router-dom';

import SearchIcon from '@/shared/assets/icons/header/search.svg?react';
import { CategoryList } from '@/widgets';

export default function HomePage() {
  const navigate = useNavigate();

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
    </div>
  );
}
