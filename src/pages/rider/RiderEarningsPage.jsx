import CoinIcon from '@/shared/assets/icons/coin.svg?react';

const TODAY_EARNINGS = 28500;
const TODAY_COUNT = 6;
const WEEK_EARNINGS = 142000;
const WEEK_COUNT = 31;

const RECENT_DELIVERIES = [
  { id: 101, storeName: '맥도날드 강남점', time: '오후 6:42', fee: 4500 },
  { id: 100, storeName: '버거킹 선릉점', time: '오후 5:17', fee: 5000 },
  { id: 99, storeName: 'BBQ 삼성점', time: '오후 4:03', fee: 4000 },
  { id: 98, storeName: '피자헛 역삼점', time: '오후 2:51', fee: 5500 },
  { id: 97, storeName: '도미노피자 대치점', time: '오후 1:22', fee: 4500 },
  { id: 96, storeName: '교촌치킨 삼성점', time: '오전 11:48', fee: 5000 },
];

export default function RiderEarningsPage() {
  const averageTodayFee =
    TODAY_COUNT > 0 ? Math.round(TODAY_EARNINGS / TODAY_COUNT) : 0;
  const averageWeekFee = Math.round(WEEK_EARNINGS / 7);

  return (
    <div className="bg-[var(--color-atomic-coolNeutral-97)] min-h-full pb-6">
      <div className="bg-white px-4 py-4 flex items-center gap-2">
        <CoinIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-normal)]" />
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          수익
        </p>
      </div>

      <div className="mx-4 mt-4 rounded-xl bg-[var(--color-atomic-redOrange-80)] p-5 flex flex-col items-center">
        <p className="text-body3 text-white/80">오늘의 수익</p>
        <p className="mt-1 text-[26px] font-bold text-white">
          {TODAY_EARNINGS.toLocaleString()}원
        </p>

        <div className="mt-3 flex items-center gap-4">
          <div className="text-center">
            <p className="text-[11px] text-white/70">완료</p>
            <p className="text-body2 font-semibold text-white">
              {TODAY_COUNT}건
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
              {WEEK_EARNINGS.toLocaleString()}원
            </p>
            <p className="mt-0.5 text-body3 text-[var(--color-semantic-label-alternative)]">
              총 {WEEK_COUNT}건 완료
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

        <div className="rounded-xl bg-white overflow-hidden">
          {RECENT_DELIVERIES.map((delivery, index) => (
            <div
              key={delivery.id}
              className={`flex items-center justify-between px-4 py-3.5 ${
                index < RECENT_DELIVERIES.length - 1
                  ? 'border-b border-[var(--color-semantic-line-normal-normal)]'
                  : ''
              }`}
            >
              <div>
                <p className="text-body2 text-[var(--color-semantic-label-normal)]">
                  {delivery.storeName}
                </p>
                <p className="mt-0.5 text-body3 text-[var(--color-semantic-label-alternative)]">
                  {delivery.time}
                </p>
              </div>

              <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
                +{delivery.fee.toLocaleString()}원
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
