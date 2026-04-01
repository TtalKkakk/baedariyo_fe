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
  return `${ampm} ${h % 12 || 12}:${m}분 도착 예정`;
}

// 가게 마커 (핀 아이콘 - 주황)
const STORE_MARKER_HTML = `
  <div style="display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.25));pointer-events:none;user-select:none;">
    <svg width="44" height="44" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 17C18.2091 17 20 15.2091 20 13C20 10.7909 18.2091 9 16 9C13.7909 9 12 10.7909 12 13C12 15.2091 13.7909 17 16 17Z" stroke="#FF6B35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M26 13C26 22 16 29 16 29C16 29 6 22 6 13C6 10.3478 7.05357 7.8043 8.92893 5.92893C10.8043 4.05357 13.3478 3 16 3C18.6522 3 21.1957 4.05357 23.0711 5.92893C24.9464 7.8043 26 10.3478 26 13Z" stroke="#FF6B35" stroke-width="2" fill="#FFF0EB" stroke-linecap="round" stroke-linejoin="round"/>
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
  const navigate = useNavigate();
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const kakaoRef = useRef(null);
  const riderRef = useRef(null);
  const storeCoordsRef = useRef(null);   // { lat, lng }
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
          const deliveryPt = new kakao.maps.LatLng(deliveryC.lat, deliveryC.lng);
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
          <path d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* 하단 패널 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.10)] px-5 pt-5 pb-6">
        {/* 드래그 핸들 */}
        <div className="w-10 h-1 bg-[var(--color-semantic-line-normal-normal)] rounded-full mx-auto mb-4" />

        {/* 상태 메시지 */}
        <p className="text-[21px] font-bold text-[var(--color-semantic-label-normal)] leading-snug">
          {STATUS_MESSAGES[deliveryStatus] ?? ''}
        </p>

        {/* 프로그레스 트랙 + 점 + 도착 예정 */}
        <div className="relative mt-5 h-[3px]">
          {/* 도착 예정 — 배달완료 점 위에 */}
          <div className="absolute -top-9 right-0 text-center">
            <p className="text-[12px] text-[var(--color-semantic-label-alternative)] leading-tight whitespace-nowrap">
              {arrivalTime.replace(' 도착 예정', '')}
            </p>
            <p className="text-[12px] text-[var(--color-semantic-label-alternative)] leading-tight whitespace-nowrap">
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
                background: i <= currentStep
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
        {order.storeName}의<br />주문이 맛있게 도착했어요
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

// ─── 기존 결제 상태 추적 (active order가 아닌 경우) ──────────

const TRACKING_STEPS = [
  { key: 'READY', title: '주문 생성', description: '주문이 생성되어 접수 대기 중입니다.' },
  { key: 'REQUESTED', title: '결제 요청', description: '결제 요청이 전송되었습니다.' },
  { key: 'APPROVED', title: '결제 완료', description: '결제가 승인되었습니다.' },
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
  return (Array.isArray(payments) ? payments : []).find(
    (p) => getPaymentRouteId(p) === routeId
  ) ?? null;
}

function PaymentTrackingView({ payment, onBack, onToDetail }) {
  const currentStepIndex = getCurrentStepIndex(payment?.paymentStatus);
  const isFailedOrCanceled =
    payment?.paymentStatus === 'FAILED' || payment?.paymentStatus === 'CANCELED';
  const orderMenus = Array.isArray(payment?.orderMenus) ? payment.orderMenus : [];

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
          <span className={`rounded-full px-2 py-0.5 text-[12px] ${getPaymentStatusClassName(payment?.paymentStatus)}`}>
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
            주문이 {payment?.paymentStatus === 'FAILED' ? '실패' : '취소'} 상태입니다.
          </p>
        </section>
      ) : (
        <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
          <p className="text-[16px] font-semibold text-[var(--color-semantic-label-normal)]">진행 단계</p>
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
                <li key={step.key} className={`rounded-lg border px-3 py-2 ${stepClassName(variant)}`}>
                  <p className="text-[14px] font-semibold text-[var(--color-semantic-label-normal)]">{step.title}</p>
                  <p className="mt-0.5 text-[13px] text-[var(--color-semantic-label-alternative)]">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
        <p className="text-[16px] font-semibold text-[var(--color-semantic-label-normal)]">주문 메뉴</p>
        {orderMenus.length === 0 ? (
          <p className="mt-2 text-[13px] text-[var(--color-semantic-label-alternative)]">메뉴 정보가 없습니다.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {orderMenus.map((menu, i) => (
              <li key={`${menu?.menuName}-${i}`} className="flex items-center justify-between text-[13px]">
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

  // active order에서 paymentId로 조회
  const activeOrders = useActiveOrderStore((state) => state.activeOrders);
  const paymentId = Number(orderId);
  const activeOrder = activeOrders.find((o) => o.paymentId === paymentId) ?? null;

  // active order가 있으면 실시간 지도 뷰
  if (activeOrder) {
    return <RealtimeTrackingView order={activeOrder} />;
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
        <p className="text-[15px] font-semibold text-[var(--color-semantic-label-normal)]">잘못된 주문 경로입니다.</p>
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
    return <p className="py-6 text-[14px] text-[var(--color-semantic-label-alternative)]">주문 추적 정보를 불러오는 중입니다...</p>;
  }

  if (shouldFetch && isError) {
    return (
      <div className="py-6">
        <p className="text-[14px] font-semibold text-[var(--color-semantic-status-cautionary)]">
          {getPaymentErrorMessage(error, '주문 추적 정보를 불러오지 못했습니다.')}
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
        <p className="text-[15px] font-semibold text-[var(--color-semantic-label-normal)]">추적할 주문 정보를 찾을 수 없습니다.</p>
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

  return <PaymentTrackingView payment={payment} onBack={() => navigate(-1)} onToDetail={toDetail} />;
}
