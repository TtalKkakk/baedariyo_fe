import { useNavigate } from 'react-router-dom';

import ArrowIcon from '@/shared/assets/icons/header/arrow.svg?react';
import CartIcon from '@/shared/assets/icons/header/cart.svg?react';
import LocationIcon from '@/shared/assets/icons/header/location.svg?react';
import SearchIcon from '@/shared/assets/icons/header/search.svg?react';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between py-3 px-4 bg-white sticky top-0 z-10">
      <button className="flex items-center pl-1">
        <LocationIcon />
        <span className="text-[20px] font-bold text-[var(--color-semantic-static-black)] ml-[10px] mr-[6px]">
          주소지
        </span>
        <ArrowIcon className="size-4 [&_path]:fill-[var(--color-semantic-label-normal)]" />
      </button>
      <div className="flex items-center gap-5">
        <button onClick={() => navigate('/search')}>
          <SearchIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-normal)]" />
        </button>
        <button onClick={() => navigate('/cart')} className="pr-[6px]">
          <CartIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-normal)]" />
        </button>
      </div>
    </header>
  );
}
