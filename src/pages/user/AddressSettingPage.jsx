import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loadKakaoMapSdk } from '@/shared/lib/loadKakaoMap';
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
            <span className="px-[6px] py-[2px] rounded-sm text-[12px] bg-[var(--color-atomic-redOrange-95)] text-[var(--color-atomic-redOrange-80)]">
              현재 설정된 주소
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
  const defaultAddressId = useAddressBookStore(
    (state) => state.defaultAddressId
  );
  const setDefaultAddress = useAddressBookStore(
    (state) => state.setDefaultAddress
  );

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [locating, setLocating] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadKakaoMapSdk()
        .then((kakao) => {
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.addressSearch(query, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              setSearchResults(result);
            } else {
              setSearchResults([]);
            }
          });
        })
        .catch(() => setSearchResults([]));
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = (addressId) => {
    setDefaultAddress(addressId);
    navigate('/');
  };

  const handleSearchResultClick = (item) => {
    navigate('/address/register', {
      state: {
        roadAddress: item.road_address?.address_name ?? item.address_name,
        jibunAddress: item.address?.address_name ?? '',
        latitude: Number(item.y),
        longitude: Number(item.x),
      },
    });
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        navigate('/address/location', {
          state: { latitude: coords.latitude, longitude: coords.longitude },
        });
      },
      () => setLocating(false)
    );
  };

  return (
    <div className="min-h-full bg-white pt-4">
      <div className="flex items-center gap-3 h-10 px-4 border border-[var(--color-semantic-line-normal-normal)] rounded-lg">
        <SearchIcon className="size-5 shrink-0 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="지번, 도로명, 건물명으로 검색"
          className="flex-1 text-body2 text-[var(--color-semantic-label-normal)] placeholder:text-[var(--color-semantic-label-alternative)] outline-none"
        />
      </div>

      <button
        type="button"
        onClick={handleCurrentLocation}
        disabled={locating}
        className="mt-3 w-full h-8 py-1.5 flex items-center justify-center gap-2 border border-[var(--color-atomic-coolNeutral-80)] rounded-[6px] text-body2 font-medium text-[var(--color-semantic-label-neutral)] disabled:opacity-50"
      >
        <CurrentLocationIcon className="size-4 [&_path]:fill-[var(--color-semantic-label-neutral)]" />
        {locating ? '위치 확인 중...' : '현재 위치로 찾기'}
      </button>

      {searchResults.length > 0 ? (
        <ul className="mt-4">
          {searchResults.map((item) => (
            <li key={item.address_name}>
              <button
                type="button"
                onClick={() => handleSearchResultClick(item)}
                className="w-full text-left py-4 border-b border-[var(--color-semantic-line-normal-normal)] last:border-b-0"
              >
                <p className="text-[15px] font-medium text-[var(--color-semantic-label-normal)]">
                  {item.road_address?.address_name ?? item.address_name}
                </p>
                {item.address?.address_name && (
                  <p className="mt-0.5 text-[13px] text-[var(--color-semantic-label-alternative)]">
                    {item.address.address_name}
                  </p>
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4">
          {[...addresses]
            .sort((a, b) =>
              a.id === defaultAddressId ? -1 : b.id === defaultAddressId ? 1 : 0
            )
            .map((address) => (
              <AddressItem
                key={address.id}
                address={address}
                isDefault={address.id === defaultAddressId}
                onSelect={handleSelect}
              />
            ))}
        </div>
      )}
    </div>
  );
}
