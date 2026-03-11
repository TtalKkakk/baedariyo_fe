import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CurrentLocationIcon from '@/shared/assets/icons/header/currentlocation.svg?react';
import SearchIcon from '@/shared/assets/icons/header/search.svg?react';

export default function AddressSearchPage() {
  const navigate = useNavigate();
  const [locating, setLocating] = useState(false);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocating(false);
        navigate('/address/location', { state: { latitude, longitude } });
      },
      () => {
        setLocating(false);
      }
    );
  };

  return (
    <div className="min-h-full bg-white px-4 pt-2">
      <p className="text-h3 font-bold text-[var(--color-semantic-label-normal)]">
        배달 받을 주소를 검색해주세요
      </p>

      <div className="mt-4 flex items-center gap-3 h-10 pl-2 pr-4 border border-[var(--color-semantic-line-normal-normal)] rounded-lg">
        <SearchIcon className="size-5 shrink-0 [&_path]:fill-[var(--color-atomic-common-0)]" />
        <input
          type="text"
          placeholder="지번, 도로명, 건물명으로 검색"
          className="flex-1 text-body1 font-normal text-[var(--color-semantic-label-normal)] placeholder:text-[var(--color-semantic-label-alternative)] placeholder:font-normal outline-none"
        />
      </div>

      <button
        type="button"
        onClick={handleCurrentLocation}
        disabled={locating}
        className="mt-2 w-full h-8 py-1.5 flex items-center justify-center gap-2 border border-[var(--color-atomic-coolNeutral-80)] rounded-[6px] text-body2 font-medium text-[var(--color-semantic-label-neutral)] disabled:opacity-50"
      >
        <CurrentLocationIcon className="size-4 [&_path]:fill-[var(--color-semantic-label-normal)]" />
        {locating ? '위치 확인 중...' : '현재 위치로 찾기'}
      </button>
    </div>
  );
}
