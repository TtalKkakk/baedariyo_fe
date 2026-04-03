import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getRiderDeliveryHistory } from '@/shared/api';
import CoinIcon from '@/shared/assets/icons/coin.svg?react';

function isSameDay(date, reference) {
  return date.toDateString() === reference.toDateString();
}

function isThisWeek(date) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return date >= startOfWeek;
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function RiderEarningsPage() {
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['rider-delivery-history'],
    queryFn: getRiderDeliveryHistory,
  });

  const {
    todayEarnings,
    todayCount,
    weekEarnings,
    weekCount,
    todayDeliveries,
  } = useMemo(() => {
    const now = new Date();
    const todayItems = history.filter((item) =>
      isSameDay(new Date(item.deliveryCompleteAt), now)
    );
    const weekItems = history.filter((item) =>
      isThisWeek(new Date(item.deliveryCompleteAt))
    );

    return {
      todayEarnings: todayItems.reduce(
        (sum, item) => sum + item.deliveryFee,
        0
      ),
      todayCount: todayItems.length,
      weekEarnings: weekItems.reduce((sum, item) => sum + item.deliveryFee, 0),
      weekCount: weekItems.length,
      todayDeliveries: todayItems,
    };
  }, [history]);

  const averageTodayFee =
    todayCount > 0 ? Math.round(todayEarnings / todayCount) : 0;
  const averageWeekFee = weekCount > 0 ? Math.round(weekEarnings / 7) : 0;

  return (
    <div className="bg-[var(--color-atomic-coolNeutral-97)] min-h-full pb-6">
      <div className="bg-white px-4 py-4 flex items-center gap-2">
        <CoinIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-normal)]" />
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          수익
        </p>
      </div>

      {isLoading ? (
        <div className="mt-8 text-center text-body2 text-[var(--color-semantic-label-alternative)]">
          불러오는 중...
        </div>
      ) : (
        <>
          <div className="mx-4 mt-4 rounded-xl bg-[var(--color-atomic-redOrange-80)] p-5 flex flex-col items-center">
            <p className="text-body3 text-white/80">오늘의 수익</p>
            <p className="mt-1 text-[26px] font-bold text-white">
              {todayEarnings.toLocaleString()}원
            </p>

            <div className="mt-3 flex items-center gap-4">
              <div className="text-center">
                <p className="text-[11px] text-white/70">완료</p>
                <p className="text-body2 font-semibold text-white">
                  {todayCount}건
                </p>
              </div>

              <div className="w-px h-8 bg-white/30" />

              <div className="text-center">
                <p className="text-[11px] text-white/70">평균 수수료</p>
                <p className="text-body2 font-semibold text-white">
                  {averageTodayFee.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>

          <div className="mx-4 mt-3 rounded-xl bg-white p-4">
            <p className="text-body3 text-[var(--color-semantic-label-alternative)] mb-3">
              이번 주
            </p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)]">
                  {weekEarnings.toLocaleString()}원
                </p>
                <p className="mt-0.5 text-body3 text-[var(--color-semantic-label-alternative)]">
                  총 {weekCount}건 완료
                </p>
              </div>

              <div className="text-right">
                <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
                  일 평균
                </p>
                <p className="text-body2 font-semibold text-[var(--color-atomic-redOrange-80)]">
                  {averageWeekFee.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>

          <div className="mx-4 mt-4">
            <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] mb-3">
              오늘 배달 내역
            </p>

            {todayDeliveries.length === 0 ? (
              <div className="rounded-xl bg-white px-4 py-6 text-center text-body2 text-[var(--color-semantic-label-alternative)]">
                오늘 완료한 배달이 없습니다.
              </div>
            ) : (
              <div className="rounded-xl bg-white overflow-hidden">
                {todayDeliveries.map((delivery, index) => (
                  <div
                    key={delivery.orderId}
                    className={`flex items-center justify-between px-4 py-3.5 ${
                      index < todayDeliveries.length - 1
                        ? 'border-b border-[var(--color-semantic-line-normal-normal)]'
                        : ''
                    }`}
                  >
                    <div>
                      <p className="text-body2 text-[var(--color-semantic-label-normal)]">
                        {delivery.storeName}
                      </p>
                      <p className="mt-0.5 text-body3 text-[var(--color-semantic-label-alternative)]">
                        {formatTime(delivery.deliveryCompleteAt)}
                      </p>
                    </div>

                    <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
                      +{delivery.deliveryFee.toLocaleString()}원
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
