import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getMyPayments } from '@/shared/api';
import { useActiveOrderStore, DELIVERY_STATUS_LABELS } from '@/shared/store';
import { loadKakaoMapSdk } from '@/shared/lib/loadKakaoMap';
import {
  formatPaymentAmount,
  formatPaymentDateTime,
  getPaymentErrorMessage,
  getPaymentRouteId,
  getPaymentStatusClassName,
  getPaymentStatusLabel,
} from '@/shared/lib/paymentView';

// ─── 실시간 지도 추적 ──────────────────────────────────────

const DELIVERING_MS = 50_000; // useActiveOrderStore DELIVERING 단계 시간과 동일

// 지오코딩/장소검색 실패 시 폴백 좌표 (서울 시청)
const FALLBACK = { lat: 37.5665, lng: 126.978 };

const STEPS = ['메뉴 준비', '배달 시작', '배달 완료'];

const STEP_BY_STATUS = {
  CONFIRMED: 0,
  PREPARING: 0,
  DELIVERING: 1,
  DELIVERED: 2,
};

const STATUS_MESSAGES = {
  CONFIRMED: '주문이 접수되었어요',
  PREPARING: '지금은 메뉴를 준비 중이에요',
  DELIVERING: '라이더가 배달 중이에요',
  DELIVERED: '배달이 완료되었어요',
};

function getArrivalTime() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 30);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h < 12 ? '오전' : '오후';
  return `${ampm} ${h % 12 || 12}:${m} 도착 예정`;
}

// 가게 마커 (핀 아이콘 - 주황)
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

// 배달지 마커 (집 아이콘 - 주황 배경)
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

// 라이더 마커 (오토바이 아이콘 - 다크 배경)
const RIDER_OVERLAY_HTML = `
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

function RealtimeTrackingView({ order }) {
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const kakaoRef = useRef(null);
  const riderRef = useRef(null);
  const storeCoordsRef = useRef(null); // { lat, lng }
  const deliveryCoordsRef = useRef(null); // { lat, lng }
  const intervalRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [arrivalTime] = useState(getArrivalTime);

  const { deliveryStatus } = order;
  const currentStep = STEP_BY_STATUS[deliveryStatus] ?? 0;

  // 지도 초기화 + 가게/배달지 실좌표 조회 (최초 1회)
  useEffect(() => {
    let alive = true;

    loadKakaoMapSdk()
      .then((kakao) => {
        if (!alive || !mapElRef.current) return;

        const map = new kakao.maps.Map(mapElRef.current, {
          center: new kakao.maps.LatLng(FALLBACK.lat, FALLBACK.lng),
          level: 5,
        });
        mapRef.current = map;
        kakaoRef.current = kakao;

        const geocoder = new kakao.maps.services.Geocoder();
        const places = new kakao.maps.services.Places();

        let storeC = null;
        let deliveryC = null;
        let pending = 2;

        function onBothReady() {
          if (!alive) return;

          // 가게 마커 (핀 아이콘)
          const storePt = new kakao.maps.LatLng(storeC.lat, storeC.lng);
          new kakao.maps.CustomOverlay({
            position: storePt,
            content: STORE_MARKER_HTML,
            map,
            yAnchor: 1,
            xAnchor: 0.5,
            zIndex: 2,
          });

          // 배달지 마커 (집 아이콘)
          const deliveryPt = new kakao.maps.LatLng(
            deliveryC.lat,
            deliveryC.lng
          );
          new kakao.maps.CustomOverlay({
            position: deliveryPt,
            content: HOUSE_MARKER_HTML,
            map,
            yAnchor: 0.5,
            xAnchor: 0.5,
            zIndex: 2,
          });

          // 라이더 오버레이 (가게에서 시작)
          const rider = new kakao.maps.CustomOverlay({
            position: storePt,
            content: RIDER_OVERLAY_HTML,
            map,
            yAnchor: 0.5,
            xAnchor: 0.5,
            zIndex: 3,
          });

          riderRef.current = rider;
          storeCoordsRef.current = storeC;
          deliveryCoordsRef.current = deliveryC;

          // 두 마커 모두 보이도록 bounds 설정
          const bounds = new kakao.maps.LatLngBounds();
          bounds.extend(storePt);
          bounds.extend(deliveryPt);
          map.setBounds(bounds, 100, 40, 220, 40);

          setIsMapReady(true);
        }

        function checkReady() {
          pending -= 1;
          if (pending === 0) onBothReady();
        }

        // 배달 주소 → 좌표
        const addr = order.deliveryRoadAddress;
        if (addr) {
          geocoder.addressSearch(addr, (result, status) => {
            deliveryC =
              status === kakao.maps.services.Status.OK
                ? { lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) }
                : FALLBACK;
            checkReady();
          });
        } else {
          deliveryC = FALLBACK;
          checkReady();
        }

        // 가게 이름 → 좌표 (장소 검색)
        const storeName = order.storeName;
        if (storeName) {
          places.keywordSearch(storeName, (result, status) => {
            storeC =
              status === kakao.maps.services.Status.OK
                ? { lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) }
                : FALLBACK;
            checkReady();
          });
        } else {
          storeC = FALLBACK;
          checkReady();
        }
      })
      .catch((err) => console.error('카카오맵 로드 실패:', err));

    return () => {
      alive = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 상태 변경 시 라이더 이동
  useEffect(() => {
    if (!isMapReady) return;

    const kakao = kakaoRef.current;
    const map = mapRef.current;
    const rider = riderRef.current;
    const storeC = storeCoordsRef.current;
    const deliveryC = deliveryCoordsRef.current;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (deliveryStatus === 'CONFIRMED' || deliveryStatus === 'PREPARING') {
      rider.setPosition(new kakao.maps.LatLng(storeC.lat, storeC.lng));
    } else if (deliveryStatus === 'DELIVERING') {
      const t0 = Date.now();
      intervalRef.current = setInterval(() => {
        const p = Math.min((Date.now() - t0) / DELIVERING_MS, 1);
        const lat = storeC.lat + (deliveryC.lat - storeC.lat) * p;
        const lng = storeC.lng + (deliveryC.lng - storeC.lng) * p;
        const pt = new kakao.maps.LatLng(lat, lng);
        rider.setPosition(pt);
        map.setCenter(pt);

        if (p >= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 300);
    } else if (deliveryStatus === 'DELIVERED') {
      rider.setPosition(new kakao.maps.LatLng(deliveryC.lat, deliveryC.lng));
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isMapReady, deliveryStatus]);

  const handleRecenter = () => {
    if (mapRef.current && riderRef.current) {
      mapRef.current.setCenter(riderRef.current.getPosition());
    }
  };

  // 배달완료 시 완료 화면
  if (deliveryStatus === 'DELIVERED') {
    return <DeliveredView order={order} />;
  }

  // 점 위치 (트랙 기준 %)
  const DOT_POSITIONS = [5, 50, 95];
  const orangeWidth = `${DOT_POSITIONS[currentStep]}%`;

  return (
    <div className="-mx-4 -mt-2 -mb-2 h-full relative overflow-hidden">
      {/* 카카오맵 */}
      <div ref={mapElRef} className="absolute inset-0" />

      {/* 현재 위치로 이동 버튼 */}
      <button
        type="button"
        onClick={handleRecenter}
        className="absolute right-4 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md border border-[var(--color-semantic-line-normal-normal)]"
        style={{ bottom: '172px' }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="3.5" stroke="#555" strokeWidth="1.5" />
          <path
            d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18"
            stroke="#555"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* 하단 패널 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.10)] px-5 pt-5 pb-6">
        {/* 드래그 핸들 */}
        <div className="w-10 h-1 bg-[var(--color-semantic-line-normal-normal)] rounded-full mx-auto mb-4" />

        {/* 상태 메시지 */}
        <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)] leading-snug">
          {STATUS_MESSAGES[deliveryStatus] ?? ''}
        </p>

        {/* 프로그레스 트랙 + 점 + 도착 예정 */}
        <div className="relative mt-5 h-[3px]">
          {/* 도착 예정 — 배달완료 점 위에 */}
          <div className="absolute -top-9 right-0 text-center">
            <p className="text-[11px] text-[var(--color-semantic-label-alternative)] leading-tight whitespace-nowrap">
              {arrivalTime.replace(' 도착 예정', '')}
            </p>
            <p className="text-[11px] text-[var(--color-semantic-label-alternative)] leading-tight whitespace-nowrap">
              도착 예정
            </p>
          </div>
          {/* 배경 트랙 */}
          <div className="absolute inset-0 bg-[var(--color-semantic-line-normal-normal)] rounded-full" />
          {/* 주황 채움 */}
          <div
            className="absolute left-0 top-0 h-full bg-[var(--color-atomic-redOrange-80)] rounded-full transition-all duration-700"
            style={{ width: orangeWidth }}
          />
          {/* 3개 점 */}
          {DOT_POSITIONS.map((left, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[11px] h-[11px] rounded-full transition-colors duration-500"
              style={{
                left: `${left}%`,
                background:
                  i <= currentStep
                    ? 'var(--color-atomic-redOrange-80)'
                    : 'var(--color-semantic-line-normal-normal)',
              }}
            />
          ))}
        </div>

        {/* 라벨 */}
        <div className="relative mt-2 h-5">
          {STEPS.map((step, i) => (
            <p
              key={step}
              className={`absolute -translate-x-1/2 text-[13px] font-medium transition-colors duration-500 whitespace-nowrap ${
                i <= currentStep
                  ? 'text-[var(--color-atomic-redOrange-80)]'
                  : 'text-[var(--color-semantic-label-alternative)]'
              }`}
              style={{ left: `${DOT_POSITIONS[i]}%` }}
            >
              {step}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeliveredView({ order }) {
  const navigate = useNavigate();
  return (
    <div className="-mx-4 -mt-2 -mb-2 h-full flex flex-col items-center justify-center bg-white px-8">
      <p className="text-[64px] mb-2">🎉</p>
      <p className="text-[26px] font-bold text-[var(--color-semantic-label-normal)] text-center">
        배달 완료!
      </p>
      <p className="text-[15px] text-[var(--color-semantic-label-alternative)] text-center mt-3 leading-relaxed">
        {order.storeName}의<br />
        주문이 맛있게 도착했어요
      </p>
      <div className="w-full mt-12 space-y-3">
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="w-full h-[52px] rounded-xl bg-[var(--color-atomic-redOrange-80)] text-white text-[17px] font-bold"
        >
          주문 내역 보기
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full h-[52px] rounded-xl border border-[var(--color-semantic-line-normal-normal)] text-[17px] font-medium text-[var(--color-semantic-label-normal)]"
        >
          홈으로
        </button>
      </div>
    </div>
  );
}

function WaitingForRiderView() {
  return (
    <div className="-mx-4 -mt-2 -mb-2 h-full flex flex-col items-center justify-center bg-white px-8">
      <div className="size-16 rounded-full bg-[var(--color-atomic-redOrange-99)] flex items-center justify-center mb-5">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 24C7.20914 24 9 22.2091 9 20C9 17.7909 7.20914 16 5 16C2.79086 16 1 17.7909 1 20C1 22.2091 2.79086 24 5 24Z"
            stroke="var(--color-atomic-redOrange-80)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M27 24C29.2091 24 31 22.2091 31 20C31 17.7909 29.2091 16 27 16C24.7909 16 23 17.7909 23 20C23 22.2091 24.7909 24 27 24Z"
            stroke="var(--color-atomic-redOrange-80)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 7H22L27 20"
            stroke="var(--color-atomic-redOrange-80)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 10C2 10 7.91375 12.2925 11.07 13.7262C11.579 13.9603 12.1435 14.0471 12.6993 13.9768C13.2551 13.9066 13.7802 13.6821 14.215 13.3287C15.205 12.5112 16.8 12 19 12H27C25.2537 11.9995 23.5553 12.5704 22.1638 13.6255C20.7724 14.6807 19.7644 16.1621 19.2938 17.8438C19.1147 18.4672 18.737 19.0151 18.2181 19.4043C17.6991 19.7935 17.0674 20.0026 16.4188 20H5"
            stroke="var(--color-atomic-redOrange-80)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-[22px] font-bold text-[var(--color-semantic-label-normal)] text-center">
        라이더를 배정 중이에요
      </p>
      <p className="text-[15px] text-[var(--color-semantic-label-alternative)] text-center mt-3 leading-relaxed">
        주문이 완료됐어요.
        <br />
        가까운 라이더를 찾고 있어요
      </p>
      <div className="flex gap-1.5 mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="size-2 rounded-full bg-[var(--color-atomic-redOrange-80)] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── 기존 결제 상태 추적 (active order가 아닌 경우) ──────────

const TRACKING_STEPS = [
  {
    key: 'READY',
    title: '주문 생성',
    description: '주문이 생성되어 접수 대기 중입니다.',
  },
  {
    key: 'REQUESTED',
    title: '결제 요청',
    description: '결제 요청이 전송되었습니다.',
  },
  {
    key: 'APPROVED',
    title: '결제 완료',
    description: '결제가 승인되었습니다.',
  },
];

function getCurrentStepIndex(status) {
  return ['READY', 'REQUESTED', 'APPROVED'].indexOf(status);
}

function stepClassName(variant) {
  if (variant === 'completed')
    return 'border-[var(--color-atomic-blue-65)] bg-[var(--color-atomic-blue-95)]';
  if (variant === 'current')
    return 'border-[var(--color-atomic-redOrange-80)] bg-[var(--color-atomic-redOrange-99)]';
  return 'border-[var(--color-semantic-line-normal-normal)] bg-white';
}

function findByRouteId(payments, routeId) {
  return (
    (Array.isArray(payments) ? payments : []).find(
      (p) => getPaymentRouteId(p) === routeId
    ) ?? null
  );
}

function PaymentTrackingView({ payment, onToDetail }) {
  const currentStepIndex = getCurrentStepIndex(payment?.paymentStatus);
  const isFailedOrCanceled =
    payment?.paymentStatus === 'FAILED' ||
    payment?.paymentStatus === 'CANCELED';
  const orderMenus = Array.isArray(payment?.orderMenus)
    ? payment.orderMenus
    : [];

  return (
    <div className="min-h-full bg-white py-4 pb-8">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onToDetail}
          className="h-8 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-[13px] font-medium text-[var(--color-semantic-label-normal)]"
        >
          상세로
        </button>
      </div>

      <section className="mt-3 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[16px] font-semibold text-[var(--color-semantic-label-normal)]">
            {payment?.storeName ?? '가게명 없음'}
          </p>
          <span
            className={`rounded-full px-2 py-0.5 text-[12px] ${getPaymentStatusClassName(payment?.paymentStatus)}`}
          >
            {getPaymentStatusLabel(payment?.paymentStatus)}
          </span>
        </div>
        <p className="mt-1 text-[13px] text-[var(--color-semantic-label-alternative)]">
          주문일시: {formatPaymentDateTime(payment?.createdAt)}
        </p>
        <p className="mt-1 text-[13px] text-[var(--color-semantic-label-alternative)]">
          결제금액: {formatPaymentAmount(payment?.amount)}
        </p>
      </section>

      {isFailedOrCanceled ? (
        <section className="mt-4 rounded-xl border border-[var(--color-semantic-status-cautionary)] bg-[var(--color-atomic-redOrange-99)] p-4">
          <p className="text-[16px] font-semibold text-[var(--color-semantic-status-cautionary)]">
            주문이 {payment?.paymentStatus === 'FAILED' ? '실패' : '취소'}{' '}
            상태입니다.
          </p>
        </section>
      ) : (
        <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
          <p className="text-[16px] font-semibold text-[var(--color-semantic-label-normal)]">
            진행 단계
          </p>
          <ol className="mt-3 space-y-2">
            {TRACKING_STEPS.map((step, index) => {
              const variant =
                currentStepIndex === -1
                  ? 'pending'
                  : index < currentStepIndex
                    ? 'completed'
                    : index === currentStepIndex
                      ? 'current'
                      : 'pending';
              return (
                <li
                  key={step.key}
                  className={`rounded-lg border px-3 py-2 ${stepClassName(variant)}`}
                >
                  <p className="text-[14px] font-semibold text-[var(--color-semantic-label-normal)]">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[var(--color-semantic-label-alternative)]">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
        <p className="text-[16px] font-semibold text-[var(--color-semantic-label-normal)]">
          주문 메뉴
        </p>
        {orderMenus.length === 0 ? (
          <p className="mt-2 text-[13px] text-[var(--color-semantic-label-alternative)]">
            메뉴 정보가 없습니다.
          </p>
        ) : (
          <ul className="mt-2 space-y-1">
            {orderMenus.map((menu, i) => (
              <li
                key={`${menu?.menuName}-${i}`}
                className="flex items-center justify-between text-[13px]"
              >
                <span className="text-[var(--color-semantic-label-normal)]">
                  {menu?.menuName ?? '메뉴'} x{menu?.quantity ?? 0}
                </span>
                <span className="text-[var(--color-semantic-label-alternative)]">
                  {formatPaymentAmount(menu?.price)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// ─── 메인 라우트 컴포넌트 ──────────────────────────────────

export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId = '' } = useParams();

  const activeOrders = useActiveOrderStore((state) => state.activeOrders);
  const paymentId = Number(orderId);
  const activeOrder =
    activeOrders.find((o) => o.paymentId === paymentId) ?? null;

  const lastOrderRef = useRef(null);
  if (activeOrder) lastOrderRef.current = activeOrder;
  const lastOrder = lastOrderRef.current;

  // active order가 있으면 실시간 추적 뷰
  if (activeOrder) {
    if (activeOrder.deliveryStatus === 'WAITING') {
      return <WaitingForRiderView />;
    }
    return <RealtimeTrackingView order={activeOrder} />;
  }

  // DELIVERED 후 activeOrder가 사라져도 완료 화면 유지
  if (lastOrder?.deliveryStatus === 'DELIVERED') {
    return <DeliveredView order={lastOrder} />;
  }

  // 아니면 기존 결제 상태 뷰
  return (
    <LegacyTrackingWrapper
      orderId={orderId}
      navigate={navigate}
      location={location}
    />
  );
}

function LegacyTrackingWrapper({ orderId, navigate, location }) {
  const routeId = orderId.trim();
  const searchParams = new URLSearchParams(location.search);
  const selectedStatus = searchParams.get('status') || 'ALL';
  const queryStatus = selectedStatus === 'ALL' ? undefined : selectedStatus;

  const statePayment = location.state?.payment ?? null;
  const isMatch = statePayment && getPaymentRouteId(statePayment) === routeId;
  const shouldFetch = Boolean(routeId) && !isMatch;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['order-tracking', routeId, queryStatus ?? 'ALL'],
    queryFn: () => getMyPayments(queryStatus),
    enabled: shouldFetch,
    retry: 1,
  });

  const payment = isMatch ? statePayment : findByRouteId(data, routeId);

  const toDetail = () => {
    if (!payment) return;
    const q = selectedStatus === 'ALL' ? '' : `?status=${selectedStatus}`;
    navigate(`/orders/${routeId}${q}`, { state: { payment, routeId } });
  };

  if (!routeId) {
    return (
      <div className="py-6">
        <p className="text-[15px] font-semibold text-[var(--color-semantic-label-normal)]">
          잘못된 주문 경로입니다.
        </p>
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="mt-3 h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-[13px] font-medium text-[var(--color-semantic-label-normal)]"
        >
          주문 내역으로 이동
        </button>
      </div>
    );
  }

  if (shouldFetch && isLoading) {
    return (
      <p className="py-6 text-[14px] text-[var(--color-semantic-label-alternative)]">
        주문 추적 정보를 불러오는 중입니다...
      </p>
    );
  }

  if (shouldFetch && isError) {
    return (
      <div className="py-6">
        <p className="text-[14px] font-semibold text-[var(--color-semantic-status-cautionary)]">
          {getPaymentErrorMessage(
            error,
            '주문 추적 정보를 불러오지 못했습니다.'
          )}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-[13px] font-medium text-[var(--color-semantic-label-normal)]"
          >
            다시 시도
          </button>
          {error?.response?.status === 401 && (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-[13px] font-medium text-[var(--color-semantic-label-normal)]"
            >
              로그인하러 가기
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="py-6">
        <p className="text-[15px] font-semibold text-[var(--color-semantic-label-normal)]">
          추적할 주문 정보를 찾을 수 없습니다.
        </p>
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="mt-3 h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-[13px] font-medium text-[var(--color-semantic-label-normal)]"
        >
          주문 내역으로 이동
        </button>
      </div>
    );
  }

  return <PaymentTrackingView payment={payment} onToDetail={toDetail} />;
}
