import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  setRiderOnline,
  setRiderOffline,
  assignRiderToOrder,
} from '@/shared/api';
import { useRiderStore } from '@/shared/store';
import MotorcycleIcon from '@/shared/assets/icons/order-status/motocycle.svg?react';
import LocationIcon from '@/shared/assets/icons/header/location.svg?react';

const MOCK_CALLS = [
  {
    id: 1,
    storeName: '맥도날드 강남점',
    storeAddress: '서울 강남구 테헤란로 152',
    customerAddress: '서울 강남구 역삼동 819-3',
    distance: '1.2km',
    estimatedMinutes: 8,
    fee: 4500,
  },
  {
    id: 2,
    storeName: '버거킹 선릉점',
    storeAddress: '서울 강남구 선릉로 433',
    customerAddress: '서울 강남구 대치동 1005',
    distance: '2.4km',
    estimatedMinutes: 14,
    fee: 5000,
  },
  {
    id: 3,
    storeName: 'BBQ 삼성점',
    storeAddress: '서울 강남구 삼성로 212',
    customerAddress: '서울 강남구 삼성동 144-7',
    distance: '0.8km',
    estimatedMinutes: 6,
    fee: 4000,
  },
];

export default function RiderHomePage() {
  const navigate = useNavigate();
  const isOnline = useRiderStore((s) => s.isOnline);
  const setOnline = useRiderStore((s) => s.setOnline);
  const setOffline = useRiderStore((s) => s.setOffline);
  const [todayEarnings] = useState(28500);
  const [todayCount] = useState(6);

  const onlineMutation = useMutation({
    mutationFn: setRiderOnline,
    onSuccess: () => setOnline(),
  });

  const offlineMutation = useMutation({
    mutationFn: setRiderOffline,
    onSuccess: () => setOffline(),
  });

  const acceptMutation = useMutation({
    mutationFn: (orderId) => assignRiderToOrder({ orderId }),
    onSuccess: (_, orderId) => {
      navigate(`/rider/delivery/${orderId}`);
    },
  });

  const toggleOnline = () => {
    if (isOnline) {
      offlineMutation.mutate();
    } else {
      onlineMutation.mutate();
    }
  };

  const isTogglingOnline =
    onlineMutation.isPending || offlineMutation.isPending;

  return (
    <div className="bg-[var(--color-atomic-coolNeutral-97)] min-h-full pb-6">
      {/* 상태 바 */}
      <div className="bg-white px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MotorcycleIcon className="size-5 [&_path]:stroke-[var(--color-semantic-label-normal)]" />
          <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            라이더 홈
          </p>
        </div>
        <button
          type="button"
          onClick={toggleOnline}
          disabled={isTogglingOnline}
          className={`flex items-center gap-2 h-9 px-4 rounded-full text-body3 font-semibold transition-colors ${
            isOnline
              ? 'bg-[var(--color-atomic-redOrange-80)] text-white'
              : 'bg-[var(--color-atomic-coolNeutral-90)] text-[var(--color-semantic-label-alternative)]'
          } disabled:opacity-50`}
        >
          <span
            className={`size-2 rounded-full ${isOnline ? 'bg-white' : 'bg-[var(--color-semantic-label-alternative)]'}`}
          />
          {isOnline ? '온라인' : '오프라인'}
        </button>
      </div>

      {/* 오늘 수익 요약 */}
      <div className="mx-4 mt-4 rounded-xl bg-white p-4 flex flex-col items-center">
        <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
          오늘의 수익
        </p>
        <p className="mt-1 text-[22px] font-bold text-[var(--color-semantic-label-normal)]">
          {todayEarnings.toLocaleString()}원
        </p>
        <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
          완료한 배달{' '}
          <span className="font-semibold text-[var(--color-atomic-redOrange-80)]">
            {todayCount}건
          </span>
        </p>
      </div>

      {/* 콜 리스트 */}
      <div className="mx-4 mt-4">
        <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] mb-3">
          {isOnline ? `배달 요청 ${MOCK_CALLS.length}건` : '배달 요청'}
        </p>

        {!isOnline ? (
          <div className="rounded-xl bg-white p-6 flex flex-col items-center gap-3">
            <div className="size-12 rounded-full bg-[var(--color-atomic-coolNeutral-97)] flex items-center justify-center">
              <MotorcycleIcon className="size-6 [&_path]:stroke-[var(--color-semantic-label-alternative)]" />
            </div>
            <p className="text-body2 text-[var(--color-semantic-label-alternative)] text-center">
              온라인 상태로 전환하면
              <br />
              배달 요청을 받을 수 있어요
            </p>
            <button
              type="button"
              onClick={toggleOnline}
              disabled={isTogglingOnline}
              className="h-10 px-5 rounded-full bg-[var(--color-atomic-redOrange-80)] text-white text-body3 font-semibold disabled:opacity-50"
            >
              온라인으로 전환
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {MOCK_CALLS.map((call) => (
              <div key={call.id} className="rounded-xl bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] truncate">
                      {call.storeName}
                    </p>
                    <div className="mt-1.5 flex items-start gap-1">
                      <LocationIcon className="size-3.5 mt-0.5 shrink-0 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
                      <p className="text-body3 text-[var(--color-semantic-label-alternative)] truncate">
                        {call.customerAddress}
                      </p>
                    </div>
                  </div>
                  <p className="text-body1 font-bold text-[var(--color-atomic-redOrange-80)] shrink-0">
                    {call.fee.toLocaleString()}원
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <span className="text-body3 text-[var(--color-semantic-label-alternative)]">
                    {call.distance}
                  </span>
                  <span className="text-body3 text-[var(--color-semantic-label-alternative)]">
                    약 {call.estimatedMinutes}분
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => acceptMutation.mutate(call.id)}
                  disabled={acceptMutation.isPending}
                  className="mt-3 w-full h-10 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body2 font-semibold disabled:opacity-40"
                >
                  {acceptMutation.isPending &&
                  acceptMutation.variables === call.id
                    ? '수락 중...'
                    : '수락하기'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
