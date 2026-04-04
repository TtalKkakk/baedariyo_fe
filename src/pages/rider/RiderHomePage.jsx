import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import {
  setRiderOnline,
  setRiderOffline,
  assignRiderToOrder,
} from '@/shared/api';
import { createRiderCallsClient } from '@/shared/socket/client';
import { useRiderStore } from '@/shared/store';
import MotorcycleIcon from '@/shared/assets/icons/order-status/motocycle.svg?react';
import LocationIcon from '@/shared/assets/icons/header/location.svg?react';

const TODAY_EARNINGS = 28500;
const TODAY_COUNT = 6;

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('위치 서비스를 지원하지 않는 브라우저입니다.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      maximumAge: 60000,
    });
  });
}

export default function RiderHomePage() {
  const navigate = useNavigate();
  const isOnline = useRiderStore((state) => state.isOnline);
  const setOnline = useRiderStore((state) => state.setOnline);
  const setOffline = useRiderStore((state) => state.setOffline);

  const [calls, setCalls] = useState([]);
  const [locationError, setLocationError] = useState(null);

  const onlineMutation = useMutation({
    mutationFn: setRiderOnline,
    onSuccess: () => {
      setOnline();
      setLocationError(null);
    },
  });

  const offlineMutation = useMutation({
    mutationFn: setRiderOffline,
    onSuccess: () => {
      setOffline();
      setCalls([]);
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (orderId) => assignRiderToOrder({ orderId }),
    onSuccess: (_, orderId) => {
      setCalls((prev) => prev.filter((c) => c.orderId !== orderId));
      navigate(`/rider/delivery/${orderId}`);
    },
  });

  useEffect(() => {
    if (!isOnline) return undefined;

    const client = createRiderCallsClient({
      onCall: (call) => {
        setCalls((prev) => {
          const exists = prev.some((c) => c.orderId === call.orderId);
          return exists ? prev : [call, ...prev];
        });
      },
    });

    return () => {
      client.deactivate();
    };
  }, [isOnline]);

  const toggleOnline = async () => {
    if (onlineMutation.isPending || offlineMutation.isPending) return;

    if (isOnline) {
      offlineMutation.mutate();
      return;
    }

    try {
      await getCurrentPosition();
      onlineMutation.mutate();
    } catch {
      setLocationError('위치 권한을 허용해야 온라인 전환이 가능합니다.');
    }
  };

  const isToggling = onlineMutation.isPending || offlineMutation.isPending;

  return (
    <div className="bg-[var(--color-atomic-coolNeutral-97)] min-h-full pb-6">
      <div className="bg-white px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MotorcycleIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-normal)]" />
          <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            라이더 홈
          </p>
        </div>

        <button
          type="button"
          onClick={toggleOnline}
          disabled={isToggling}
          className={`flex items-center gap-2 h-9 px-4 rounded-full text-body3 font-semibold transition-colors ${
            isOnline
              ? 'bg-[var(--color-atomic-redOrange-80)] text-white'
              : 'bg-[var(--color-atomic-coolNeutral-90)] text-[var(--color-semantic-label-alternative)]'
          } disabled:opacity-50`}
        >
          <span
            className={`size-2 rounded-full ${
              isOnline
                ? 'bg-white'
                : 'bg-[var(--color-semantic-label-alternative)]'
            }`}
          />
          {isToggling ? '전환 중...' : isOnline ? '온라인' : '오프라인'}
        </button>
      </div>

      {locationError && (
        <div className="mx-4 mt-3 px-4 py-3 rounded-xl bg-[var(--color-semantic-status-cautionary)]/10">
          <p className="text-body3 text-[var(--color-semantic-status-cautionary)]">
            {locationError}
          </p>
        </div>
      )}

      <div className="mx-4 mt-4 rounded-xl bg-white p-4 flex flex-col items-center">
        <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
          오늘의 수익
        </p>
        <p className="mt-1 text-[22px] font-bold text-[var(--color-semantic-label-normal)]">
          {TODAY_EARNINGS.toLocaleString()}원
        </p>
        <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
          완료한 배달{' '}
          <span className="font-semibold text-[var(--color-atomic-redOrange-80)]">
            {TODAY_COUNT}건
          </span>
        </p>
      </div>

      <div className="mx-4 mt-4">
        <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] mb-3">
          {isOnline ? `배달 요청 ${calls.length}건` : '배달 요청'}
        </p>

        {!isOnline ? (
          <div className="rounded-xl bg-white p-6 flex flex-col items-center gap-3">
            <div className="size-12 rounded-full bg-[var(--color-atomic-coolNeutral-97)] flex items-center justify-center">
              <MotorcycleIcon className="size-6 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
            </div>
            <p className="text-body2 text-[var(--color-semantic-label-alternative)] text-center">
              온라인 상태로 전환하면
              <br />
              배달 요청을 받을 수 있어요
            </p>
            <button
              type="button"
              onClick={toggleOnline}
              disabled={isToggling}
              className="h-10 px-5 rounded-full bg-[var(--color-atomic-redOrange-80)] text-white text-body3 font-semibold disabled:opacity-50"
            >
              온라인으로 전환
            </button>
          </div>
        ) : calls.length === 0 ? (
          <div className="rounded-xl bg-white p-6 flex flex-col items-center gap-2">
            <p className="text-body2 text-[var(--color-semantic-label-alternative)]">
              새로운 배달 요청을 기다리는 중...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {calls.map((call) => {
              const isAcceptingThis =
                acceptMutation.isPending &&
                acceptMutation.variables === call.orderId;

              return (
                <div key={call.orderId} className="rounded-xl bg-white p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] truncate">
                        {call.storeName}
                      </p>
                      <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)] truncate">
                        {call.storeAddress}
                      </p>
                      <div className="mt-1.5 flex items-start gap-1">
                        <LocationIcon className="size-3.5 mt-0.5 shrink-0 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
                        <p className="text-body3 text-[var(--color-semantic-label-alternative)] truncate">
                          {call.customerAddress}
                        </p>
                      </div>
                    </div>

                    <p className="text-body1 font-bold text-[var(--color-atomic-redOrange-80)] shrink-0">
                      {(call.fee ?? 0).toLocaleString()}원
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    {call.distance && (
                      <span className="text-body3 text-[var(--color-semantic-label-alternative)]">
                        {call.distance}
                      </span>
                    )}
                    {call.estimatedMinutes && (
                      <span className="text-body3 text-[var(--color-semantic-label-alternative)]">
                        약 {call.estimatedMinutes}분
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => acceptMutation.mutate(call.orderId)}
                    disabled={acceptMutation.isPending}
                    className="mt-3 w-full h-10 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body2 font-semibold disabled:opacity-40"
                  >
                    {isAcceptingThis ? '수락 중...' : '수락하기'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
