import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { loadKakaoMapSdk } from '@/shared/lib/loadKakaoMap';
import BackIcon from '@/shared/assets/icons/header/back.svg?react';

const FALLBACK = { lat: 37.5665, lng: 126.978 };

const STORE_MARKER_HTML = `
  <div style="
    width:44px;height:44px;background:#FF6B35;border-radius:50%;
    border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.28);
    display:flex;align-items:center;justify-content:center;
    pointer-events:none;user-select:none;
  ">
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.2775 11.8013C3.25947 11.866 3.25022 11.9328 3.25 12V14C3.24968 14.7587 3.43109 15.5064 3.77905 16.1806C4.12701 16.8547 4.6314 17.4358 5.25 17.875V27C5.25 27.1989 5.32902 27.3897 5.46967 27.5303C5.61032 27.671 5.80109 27.75 6 27.75H26C26.1989 27.75 26.3897 27.671 26.5303 27.5303C26.671 27.3897 26.75 27.1989 26.75 27V17.875C27.3686 17.4358 27.873 16.8547 28.2209 16.1806C28.5689 15.5064 28.7503 14.7587 28.75 14V12C28.7501 11.9307 28.7404 11.8616 28.7213 11.795L26.9287 5.51875C26.8231 5.15455 26.6026 4.83426 26.3001 4.60562C25.9975 4.37697 25.6292 4.25224 25.25 4.25H6.75C6.3708 4.25224 6.00247 4.37697 5.69995 4.60562C5.39742 4.83426 5.17689 5.15455 5.07125 5.51875L3.2775 11.8013ZM6.51375 5.92625C6.52938 5.87563 6.56068 5.83128 6.60314 5.79961C6.6456 5.76793 6.69703 5.75056 6.75 5.75H25.25C25.3043 5.75008 25.357 5.7678 25.4003 5.8005C25.4436 5.8332 25.4751 5.87909 25.49 5.93125L27.0063 11.25H5L6.51375 5.92625ZM12.75 12.75H19.25V14C19.25 14.862 18.9076 15.6886 18.2981 16.2981C17.6886 16.9076 16.862 17.25 16 17.25C15.138 17.25 14.3114 16.9076 13.7019 16.2981C13.0924 15.6886 12.75 14.862 12.75 14V12.75ZM4.75 12.75H11.25V14C11.2506 14.5609 11.1061 15.1124 10.8305 15.6008C10.5548 16.0893 10.1575 16.4981 9.67704 16.7876C9.19661 17.077 8.64945 17.2371 8.08878 17.2525C7.52811 17.2678 6.97303 17.1377 6.4775 16.875C6.41594 16.8225 6.34629 16.7803 6.27125 16.75C5.80584 16.4576 5.42217 16.052 5.15613 15.5711C4.89008 15.0902 4.75035 14.5496 4.75 14V12.75ZM25.25 26.25H6.75V18.5825C7.7268 18.8483 8.76296 18.795 9.70736 18.4305C10.6518 18.066 11.455 17.4093 12 16.5562C12.4286 17.2286 13.0199 17.7821 13.719 18.1655C14.4181 18.5489 15.2026 18.7499 16 18.7499C16.7974 18.7499 17.5819 18.5489 18.281 18.1655C18.9801 17.7821 19.5714 17.2286 20 16.5562C20.545 17.4093 21.3482 18.066 22.2926 18.4305C23.237 18.795 24.2732 18.8483 25.25 18.5825V26.25ZM25.7288 16.75C25.6537 16.7803 25.5841 16.8225 25.5225 16.875C25.027 17.1377 24.4719 17.2678 23.9112 17.2525C23.3506 17.2371 22.8034 17.077 22.323 16.7876C21.8425 16.4981 21.4452 16.0893 21.1695 15.6008C20.8939 15.1124 20.7494 14.5609 20.75 14V12.75H27.25V14C27.2496 14.5496 27.1099 15.0902 26.8439 15.5711C26.5778 16.052 26.1942 16.4576 25.7288 16.75Z" fill="white"/>
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
          center: new kakao.maps.LatLng(riderC.lat, riderC.lng),
          level: 4,
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

          map.setCenter(riderPt);

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
