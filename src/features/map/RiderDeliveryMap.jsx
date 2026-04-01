import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { loadKakaoMapSdk } from '@/shared/lib/loadKakaoMap';
import BackIcon from '@/shared/assets/icons/header/back.svg?react';

const FALLBACK = { lat: 37.5665, lng: 126.978 };

const STORE_MARKER_HTML = `
  <div style="display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.25));pointer-events:none;user-select:none;">
    <svg width="44" height="44" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 17C18.2091 17 20 15.2091 20 13C20 10.7909 18.2091 9 16 9C13.7909 9 12 10.7909 12 13C12 15.2091 13.7909 17 16 17Z" stroke="#FF6B35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M26 13C26 22 16 29 16 29C16 29 6 22 6 13C6 10.3478 7.05357 7.8043 8.92893 5.92893C10.8043 4.05357 13.3478 3 16 3C18.6522 3 21.1957 4.05357 23.0711 5.92893C24.9464 7.8043 26 10.3478 26 13Z" stroke="#FF6B35" stroke-width="2" fill="#FFF0EB" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
`;

const HOUSE_MARKER_HTML = `
  <div style="
    width:44px;height:44px;background:#FF6B35;border-radius:50%;
    border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.28);
    display:flex;align-items:center;justify-content:center;
    pointer-events:none;user-select:none;
  ">
    <svg width="22" height="23" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.75 23.7508V15.7508H14.75V23.7508H22.75V11.7508C22.7501 11.6194 22.7243 11.4893 22.6741 11.3679C22.6239 11.2465 22.5503 11.1362 22.4575 11.0433L12.4575 1.04329C12.3646 0.95031 12.2543 0.876551 12.1329 0.826227C12.0115 0.775903 11.8814 0.75 11.75 0.75C11.6186 0.75 11.4885 0.775903 11.3671 0.826227C11.2457 0.876551 11.1354 0.95031 11.0425 1.04329L1.0425 11.0433C0.949666 11.1362 0.876052 11.2465 0.825864 11.3679C0.775676 11.4893 0.749897 11.6194 0.75 11.7508V23.7508H8.75Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
`;

const RIDER_MARKER_HTML = `
  <div style="
    width:48px;height:48px;background:#2D2D2D;border-radius:50%;
    border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,0.35);
    display:flex;align-items:center;justify-content:center;
    pointer-events:none;user-select:none;
  ">
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 24C7.20914 24 9 22.2091 9 20C9 17.7909 7.20914 16 5 16C2.79086 16 1 17.7909 1 20C1 22.2091 2.79086 24 5 24Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M27 24C29.2091 24 31 22.2091 31 20C31 17.7909 29.2091 16 27 16C24.7909 16 23 17.7909 23 20C23 22.2091 24.7909 24 27 24Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18 7H22L27 20" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 10C2 10 7.91375 12.2925 11.07 13.7262C11.579 13.9603 12.1435 14.0471 12.6993 13.9768C13.2551 13.9066 13.7802 13.6821 14.215 13.3287C15.205 12.5112 16.8 12 19 12H27C25.2537 11.9995 23.5553 12.5704 22.1638 13.6255C20.7724 14.6807 19.7644 16.1621 19.2938 17.8438C19.1147 18.4672 18.737 19.0151 18.2181 19.4043C17.6991 19.7935 17.0674 20.0026 16.4188 20H5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
`;

function getRiderPosition() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(FALLBACK);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(FALLBACK),
      { timeout: 5000 }
    );
  });
}

export default function RiderDeliveryMap({
  storeName,
  customerAddress,
  onClose,
}) {
  const mapElRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    Promise.all([loadKakaoMapSdk(), getRiderPosition()])
      .then(([kakao, riderC]) => {
        if (!alive || !mapElRef.current) return;

        const map = new kakao.maps.Map(mapElRef.current, {
          center: new kakao.maps.LatLng(FALLBACK.lat, FALLBACK.lng),
          level: 5,
        });

        const geocoder = new kakao.maps.services.Geocoder();
        const places = new kakao.maps.services.Places();

        let storeC = null;
        let customerC = null;
        let pending = 2;

        function onBothReady() {
          if (!alive) return;

          // 가게 마커
          const storePt = new kakao.maps.LatLng(storeC.lat, storeC.lng);
          new kakao.maps.CustomOverlay({
            position: storePt,
            content: STORE_MARKER_HTML,
            map,
            yAnchor: 1,
            xAnchor: 0.5,
            zIndex: 2,
          });

          // 배달지 마커
          const customerPt = new kakao.maps.LatLng(
            customerC.lat,
            customerC.lng
          );
          new kakao.maps.CustomOverlay({
            position: customerPt,
            content: HOUSE_MARKER_HTML,
            map,
            yAnchor: 0.5,
            xAnchor: 0.5,
            zIndex: 2,
          });

          // 라이더 마커
          const riderPt = new kakao.maps.LatLng(riderC.lat, riderC.lng);
          new kakao.maps.CustomOverlay({
            position: riderPt,
            content: RIDER_MARKER_HTML,
            map,
            yAnchor: 0.5,
            xAnchor: 0.5,
            zIndex: 3,
          });

          const bounds = new kakao.maps.LatLngBounds();
          bounds.extend(storePt);
          bounds.extend(customerPt);
          bounds.extend(riderPt);
          map.setBounds(bounds, 80, 80, 80, 80);

          if (alive) setIsLoading(false);
        }

        function check() {
          pending -= 1;
          if (pending === 0) onBothReady();
        }

        if (storeName) {
          places.keywordSearch(storeName, (result, status) => {
            storeC =
              status === kakao.maps.services.Status.OK
                ? { lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) }
                : FALLBACK;
            check();
          });
        } else {
          storeC = FALLBACK;
          check();
        }

        if (customerAddress) {
          geocoder.addressSearch(customerAddress, (result, status) => {
            customerC =
              status === kakao.maps.services.Status.OK
                ? { lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) }
                : FALLBACK;
            check();
          });
        } else {
          customerC = FALLBACK;
          check();
        }
      })
      .catch((err) => {
        if (alive) {
          setErrorMessage(err.message || '지도를 불러오지 못했습니다.');
          setIsLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const portalTarget = document.querySelector('.layout-frame') || document.body;

  return createPortal(
    <div className="absolute inset-0 z-50 flex flex-col bg-white">
      {/* 상단 바 */}
      <div className="flex items-center gap-3 px-4 py-4 bg-white shrink-0 border-b border-[var(--color-semantic-line-normal-normal)]">
        <button type="button" onClick={onClose}>
          <BackIcon className="size-5" />
        </button>
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          배달 지도
        </p>
      </div>

      {/* 지도 컨테이너 */}
      <div className="flex-1 relative min-h-0">
        <div ref={mapElRef} className="absolute inset-0" />

        {isLoading && !errorMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-atomic-coolNeutral-97)]">
            <p className="text-body2 text-[var(--color-semantic-label-alternative)]">
              지도 불러오는 중...
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-atomic-coolNeutral-97)]">
            <p className="text-body2 text-[var(--color-semantic-label-alternative)] text-center px-6">
              {errorMessage}
            </p>
          </div>
        )}
      </div>

      {/* 범례 */}
      <div className="bg-white px-4 py-3 flex items-center justify-center gap-6 shrink-0 border-t border-[var(--color-semantic-line-normal-normal)]">
        <div className="flex items-center gap-1.5">
          <div className="size-3 rounded-full bg-[#2D2D2D]" />
          <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
            내 위치
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-3 rounded-full border-2 border-[var(--color-atomic-redOrange-80)]" />
          <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
            픽업 장소
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-3 rounded-full bg-[var(--color-atomic-redOrange-80)]" />
          <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
            배달 장소
          </p>
        </div>
      </div>
    </div>,
    portalTarget
  );
}
