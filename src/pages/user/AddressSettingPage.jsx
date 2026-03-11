import { useNavigate } from 'react-router-dom';

import { useAddressBookStore } from '@/shared/store';
import CheckIcon from '@/shared/assets/icons/header/check.svg?react';
import CurrentLocationIcon from '@/shared/assets/icons/header/currentlocation.svg?react';
import SearchIcon from '@/shared/assets/icons/header/search.svg?react';

function AddressItem({ address, isDefault, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(address.id)}
      className="w-full text-left py-4 border-b border-[var(--color-semantic-line-normal-normal)] last:border-b-0"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-body1 font-bold text-[var(--color-semantic-label-normal)]">
            {address.label}
          </span>
          {isDefault && (
            <span className="px-[6px] py-[2px] rounded-sm text-caption1 bg-[var(--color-atomic-blue-95)] text-[var(--color-semantic-status-info)]">
              기본 주소
            </span>
          )}
        </div>
        {isDefault && (
          <CheckIcon className="size-5 [&_path]:fill-[var(--color-atomic-redOrange-80)]" />
        )}
      </div>
      <p className="mt-1 text-body3 text-[var(--color-semantic-label-normal)]">
        {address.roadAddress}
      </p>
      {address.detailAddress ? (
        <p className="mt-[2px] text-body3 text-[var(--color-semantic-label-alternative)]">
          {address.detailAddress}
        </p>
      ) : null}
    </button>
  );
}

export default function AddressSettingPage() {
  const navigate = useNavigate();
  const addresses = useAddressBookStore((state) => state.addresses);
  const defaultAddressId = useAddressBookStore((state) => state.defaultAddressId);
  const setDefaultAddress = useAddressBookStore((state) => state.setDefaultAddress);

  const handleSelect = (addressId) => {
    setDefaultAddress(addressId);
    navigate('/');
  };

  return (
    <div className="min-h-full bg-white px-4 pt-4">
      <div className="flex items-center gap-3 h-12 px-4 border border-[var(--color-semantic-line-normal-normal)] rounded-lg">
        <SearchIcon className="size-5 shrink-0 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
        <input
          type="text"
          placeholder="지번, 도로명, 건물명으로 검색"
          className="flex-1 text-body2 text-[var(--color-semantic-label-normal)] placeholder:text-[var(--color-semantic-label-alternative)] outline-none"
        />
      </div>

      <button
        type="button"
        onClick={() => navigate('/address/register')}
        className="mt-3 w-full h-12 flex items-center justify-center gap-2 border border-[var(--color-semantic-line-normal-normal)] rounded-lg text-body2 text-[var(--color-semantic-label-normal)]"
      >
        <CurrentLocationIcon className="size-4 [&_path]:fill-[var(--color-semantic-label-normal)]" />
        현재 위치로 찾기
      </button>

      <div className="mt-4">
        {addresses.map((address) => (
          <AddressItem
            key={address.id}
            address={address}
            isDefault={address.id === defaultAddressId}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
