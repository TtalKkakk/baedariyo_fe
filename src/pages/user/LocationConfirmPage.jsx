import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { loadKakaoMapSdk } from '@/shared/lib/loadKakaoMap';
import BackIcon from '@/shared/assets/icons/header/back.svg?react';
import WarningIcon from '@/shared/assets/icons/header/warning.svg?react';

export default function LocationConfirmPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const mapElRef = useRef(null);
  const [address, setAddress] = useState({ road: '', jibun: '' });

  const latitude = state?.latitude ?? 37.5665;
  const longitude = state?.longitude ?? 126.978;

  useEffect(() => {
    let isMounted = true;

    loadKakaoMapSdk()
      .then((kakao) => {
        if (!isMounted || !mapElRef.current) return;

        const center = new kakao.maps.LatLng(latitude, longitude);
        const map = new kakao.maps.Map(mapElRef.current, {
          center,
          level: 3,
        });

        const marker = new kakao.maps.Marker({ position: center });
        marker.setMap(map);

        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2Address(longitude, latitude, (result, status) => {
          if (!isMounted) return;
          if (status === kakao.maps.services.Status.OK) {
            const road = result[0]?.road_address?.address_name ?? '';
            const jibun = result[0]?.address?.address_name ?? '';
            setAddress({ road, jibun });
          }
        });
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  const handleRegister = () => {
    navigate('/address/register', {
      state: {
        roadAddress: address.road,
        jibunAddress: address.jibun,
        latitude,
        longitude,
      },
    });
  };

  return (
    <div className="relative flex flex-col h-screen">
      {/* 헤더 */}
      <header className="relative flex items-center h-12 px-4 bg-white z-10">
        <button onClick={() => navigate(-1)} className="shrink-0">
          <BackIcon className="size-5" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 text-[18px] font-medium text-[var(--color-semantic-label-normal)]">
          위치 확인
        </span>
      </header>

      {/* 지도 */}
      <div ref={mapElRef} className="flex-1" />

      {/* 하단 시트 */}
      <div className="relative z-10 -mt-6 bg-white rounded-t-2xl px-4 pt-3 pb-8 h-56">
        <div className="w-12 h-1 bg-[var(--color-component-fill-strong)] rounded-full mx-auto mb-3.5" />
        <p className="text-body1 font-bold text-center text-[var(--color-semantic-label-normal)]">
          {address.road || '주소를 불러오는 중...'}
        </p>
        {address.jibun ? (
          <p className="mt-2 text-body1 font-medium text-center text-[var(--color-semantic-label-neutral)]">
            {address.jibun}
          </p>
        ) : null}

        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-atomic-redOrange-99)]">
          <WarningIcon className="size-4 shrink-0 [&_path]:fill-[var(--color-semantic-status-cautionary)]" />
          <span className="text-body3 text-[var(--color-semantic-status-cautionary)]">
            실제 주소와 일치하는지 확인해주세요.
          </span>
        </div>

        <button
          type="button"
          onClick={handleRegister}
          className="mt-4 w-full h-12 rounded-xl bg-[var(--color-atomic-redOrange-80)] text-body1 font-medium text-[var(--color-semantic-static-white)]"
        >
          이 위치로 주소 등록
        </button>
      </div>
    </div>
  );
}
