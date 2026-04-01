import { useNavigate } from 'react-router-dom';

const HISTORY = [
  {
    id: 101,
    storeName: '맥도날드 강남점',
    customerAddress: '서울 강남구 역삼동',
    date: '오늘',
    time: '오후 6:42',
    fee: 4500,
    distance: '1.2km',
  },
  {
    id: 100,
    storeName: '버거킹 선릉점',
    customerAddress: '서울 강남구 대치동',
    date: '오늘',
    time: '오후 5:17',
    fee: 5000,
    distance: '2.4km',
  },
  {
    id: 99,
    storeName: 'BBQ 삼성점',
    customerAddress: '서울 강남구 삼성동',
    date: '오늘',
    time: '오후 4:03',
    fee: 4000,
    distance: '0.8km',
  },
  {
    id: 95,
    storeName: '피자헛 역삼점',
    customerAddress: '서울 강남구 역삼동',
    date: '어제',
    time: '오후 8:12',
    fee: 5500,
    distance: '1.8km',
  },
  {
    id: 94,
    storeName: '도미노피자 대치점',
    customerAddress: '서울 강남구 도곡동',
    date: '어제',
    time: '오후 6:30',
    fee: 4500,
    distance: '3.1km',
  },
  {
    id: 93,
    storeName: '교촌치킨 삼성점',
    customerAddress: '서울 강남구 청담동',
    date: '어제',
    time: '오후 5:05',
    fee: 5000,
    distance: '2.2km',
  },
];

const grouped = HISTORY.reduce((acc, item) => {
  const key = item.date;
  if (!acc[key]) acc[key] = [];
  acc[key].push(item);
  return acc;
}, {});

export default function RiderHistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[var(--color-atomic-coolNeutral-97)] min-h-full pb-6">
      {/* 헤더 */}
      <div className="bg-white px-4 py-4">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          배달 내역
        </p>
      </div>

      <div className="mt-4">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="mb-4">
            <p className="px-4 mb-2 text-body3 font-semibold text-[var(--color-semantic-label-alternative)]">
              {date}
            </p>
            <div className="mx-4 rounded-xl bg-white overflow-hidden">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(`/rider/delivery/${item.id}`)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-left ${
                    i < items.length - 1
                      ? 'border-b border-[var(--color-semantic-line-normal-normal)]'
                      : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] truncate">
                      {item.storeName}
                    </p>
                    <p className="mt-0.5 text-body3 text-[var(--color-semantic-label-alternative)] truncate">
                      {item.customerAddress} · {item.distance}
                    </p>
                    <p className="mt-0.5 text-body3 text-[var(--color-semantic-label-alternative)]">
                      {item.time}
                    </p>
                  </div>
                  <div className="ml-3 text-right">
                    <p className="text-body2 font-semibold text-[var(--color-atomic-redOrange-80)]">
                      +{item.fee.toLocaleString()}원
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[var(--color-atomic-coolNeutral-97)] text-[10px] text-[var(--color-semantic-label-alternative)]">
                      완료
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
