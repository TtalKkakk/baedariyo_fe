import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { startRiderDelivery, completeRiderDelivery } from '@/shared/api';
import { RiderDeliveryMap } from '@/features/map';
import BackIcon from '@/shared/assets/icons/header/back.svg?react';
import LocationIcon from '@/shared/assets/icons/header/location.svg?react';
import MotorcycleIcon from '@/shared/assets/icons/order-status/motocycle.svg?react';
import HouseIcon from '@/shared/assets/icons/order-status/house.svg?react';
import PinIcon from '@/shared/assets/icons/order-status/pin.svg?react';

const STATUSES = ['ACCEPTED', 'PICKING_UP', 'DELIVERING', 'DELIVERED'];

const STATUS_LABELS = {
  ACCEPTED: '수락됨',
  PICKING_UP: '픽업 대기',
  DELIVERING: '배달 중',
  DELIVERED: '배달 완료',
};

const STATUS_BUTTON_LABELS = {
  ACCEPTED: '픽업 시작',
  PICKING_UP: '픽업 완료',
  DELIVERING: '배달 완료',
};

const MOCK_ORDER = {
  storeName: '맥도날드 강남점',
  storeAddress: '서울 강남구 테헤란로 152',
  customerName: '홍길동',
  customerAddress: '서울 강남구 역삼동 819-3',
  distance: '1.2km',
  estimatedMinutes: 8,
  fee: 4500,
  orderItems: ['빅맥 세트', '상하이 버거'],
  orderTotal: 18500,
};

export default function RiderDeliveryPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('ACCEPTED');

  const startMutation = useMutation({
    mutationFn: startRiderDelivery,
    onSuccess: () => setStatus('DELIVERING'),
  });

  const completeMutation = useMutation({
    mutationFn: completeRiderDelivery,
    onSuccess: () => setStatus('DELIVERED'),
  });

  const handleNext = () => {
    if (status === 'ACCEPTED') {
      setStatus('PICKING_UP');
    } else if (status === 'PICKING_UP') {
      startMutation.mutate();
    } else if (status === 'DELIVERING') {
      completeMutation.mutate();
    }
  };

  const [showMap, setShowMap] = useState(false);
  const isPending = startMutation.isPending || completeMutation.isPending;
  const isDone = status === 'DELIVERED';

  const currentStepIndex = STATUSES.indexOf(status);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-atomic-coolNeutral-97)]">
      {/* 헤더 */}
      <div className="bg-white px-4 py-4 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/rider')}>
          <BackIcon className="size-5" />
        </button>
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          배달 #{orderId}
        </p>
      </div>

      {/* 진행 상태 스텝 */}
      <div className="bg-white mt-2 mx-4 rounded-xl px-4 py-4">
        <div className="flex items-start">
          {STATUSES.map((s, i) => (
            <>
              <div
                key={s}
                className="flex flex-col items-center shrink-0 w-[48px]"
              >
                <div
                  className={`size-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    i <= currentStepIndex
                      ? 'bg-[var(--color-atomic-redOrange-80)] text-white'
                      : 'bg-[var(--color-atomic-coolNeutral-90)] text-[var(--color-semantic-label-alternative)]'
                  }`}
                >
                  {i < currentStepIndex ? '✓' : i + 1}
                </div>
                <p
                  className={`mt-1 text-[10px] text-center whitespace-nowrap ${
                    i <= currentStepIndex
                      ? 'text-[var(--color-atomic-redOrange-80)] font-semibold'
                      : 'text-[var(--color-semantic-label-alternative)]'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </p>
              </div>
              {i < STATUSES.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mt-3 ${
                    i < currentStepIndex
                      ? 'bg-[var(--color-atomic-redOrange-80)]'
                      : 'bg-[var(--color-atomic-coolNeutral-90)]'
                  }`}
                />
              )}
            </>
          ))}
        </div>
      </div>

      {/* 지도 영역 */}
      <button
        type="button"
        onClick={() => setShowMap(true)}
        className="mx-4 mt-3 rounded-xl h-[160px] w-[calc(100%-32px)] bg-[var(--color-atomic-coolNeutral-90)] flex flex-col items-center justify-center gap-2 active:opacity-80"
      >
        <LocationIcon className="size-8 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
        <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
          지도 보기
        </p>
      </button>

      {showMap && (
        <RiderDeliveryMap
          storeName={MOCK_ORDER.storeName}
          customerAddress={MOCK_ORDER.customerAddress}
          onClose={() => setShowMap(false)}
        />
      )}

      {/* 경로 정보 */}
      <div className="bg-white mx-4 mt-3 rounded-xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-[var(--color-atomic-redOrange-80)]/10 flex items-center justify-center shrink-0 mt-0.5">
            <PinIcon className="size-4 [&_path]:fill-[var(--color-atomic-redOrange-80)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
              픽업 장소
            </p>
            <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] mt-0.5">
              {MOCK_ORDER.storeName}
            </p>
            <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
              {MOCK_ORDER.storeAddress}
            </p>
          </div>
        </div>

        <div className="ml-4 border-l-2 border-dashed border-[var(--color-atomic-coolNeutral-90)] pl-4 py-1 flex items-center gap-2">
          <MotorcycleIcon className="size-4 [&_path]:stroke-[var(--color-semantic-label-alternative)]" />
          <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
            {MOCK_ORDER.distance} · 약 {MOCK_ORDER.estimatedMinutes}분
          </p>
        </div>

        <div className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-[var(--color-atomic-coolNeutral-90)] flex items-center justify-center shrink-0 mt-0.5">
            <HouseIcon className="size-4 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
              배달 장소
            </p>
            <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] mt-0.5">
              {MOCK_ORDER.customerName}
            </p>
            <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
              {MOCK_ORDER.customerAddress}
            </p>
          </div>
        </div>
      </div>

      {/* 주문 정보 */}
      <div className="bg-white mx-4 mt-3 rounded-xl p-4">
        <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] mb-3">
          주문 정보
        </p>
        <div className="space-y-2">
          {MOCK_ORDER.orderItems.map((item) => (
            <p
              key={item}
              className="text-body3 text-[var(--color-semantic-label-alternative)]"
            >
              {item}
            </p>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-[var(--color-semantic-line-normal-normal)] flex items-center justify-between">
          <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
            배달 수수료
          </p>
          <p className="text-body2 font-bold text-[var(--color-atomic-redOrange-80)]">
            {MOCK_ORDER.fee.toLocaleString()}원
          </p>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="px-4 mt-4 pb-6">
        {isDone ? (
          <div className="space-y-2">
            <div className="rounded-xl bg-white p-4 text-center">
              <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
                배달이 완료되었습니다!
              </p>
              <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
                수수료{' '}
                <span className="font-semibold text-[var(--color-atomic-redOrange-80)]">
                  {MOCK_ORDER.fee.toLocaleString()}원
                </span>
                이 적립됩니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/rider')}
              className="w-full h-11 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body1 font-semibold"
            >
              홈으로 돌아가기
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={isPending}
            className="w-full h-11 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body1 font-semibold disabled:opacity-40"
          >
            {isPending ? '처리 중...' : STATUS_BUTTON_LABELS[status]}
          </button>
        )}
      </div>
    </div>
  );
}
