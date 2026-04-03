import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';

import { getRiderDeliveryHistory } from '@/shared/api';

function formatDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return '오늘';
  if (isYesterday) return '어제';
  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function DeliveryDetailSheet({ item, onClose }) {
  const frame = document.querySelector('.layout-frame') ?? document.body;

  return createPortal(
    <div className="absolute inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-2xl shadow-[0_-4px_8px_rgba(0,0,0,0.06)]">
        <div className="flex justify-center pt-3 mb-1">
          <div className="w-12 h-[4px] rounded-full bg-[var(--color-atomic-coolNeutral-95)]" />
        </div>
        <div className="px-5 pt-2 pb-8 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-body1 font-bold text-[var(--color-semantic-label-normal)]">
              배달 완료
            </p>
            <span className="px-2 py-0.5 rounded-full bg-[var(--color-atomic-coolNeutral-97)] text-[12px] text-[var(--color-semantic-label-alternative)]">
              {formatDate(item.deliveryCompleteAt)}{' '}
              {formatTime(item.deliveryCompleteAt)}
            </span>
          </div>

          <div className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] divide-y divide-[var(--color-semantic-line-normal-normal)]">
            <div className="flex justify-between px-4 py-3">
              <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
                픽업 장소
              </p>
              <p className="text-body3 font-medium text-[var(--color-semantic-label-normal)]">
                {item.storeName}
              </p>
            </div>
            <div className="flex justify-between px-4 py-3">
              <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
                배달 장소
              </p>
              <p className="text-body3 font-medium text-[var(--color-semantic-label-normal)]">
                {item.customerAddress}
              </p>
            </div>
            <div className="flex justify-between px-4 py-3">
              <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
                배달 수수료
              </p>
              <p className="text-body2 font-bold text-[var(--color-atomic-redOrange-80)]">
                +{item.deliveryFee.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    frame
  );
}

export default function RiderHistoryPage() {
  const [selectedItem, setSelectedItem] = useState(null);

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['rider-delivery-history'],
    queryFn: getRiderDeliveryHistory,
  });

  const groupedHistory = useMemo(() => {
    return history.reduce((acc, item) => {
      const key = formatDate(item.deliveryCompleteAt);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [history]);

  return (
    <div className="bg-[var(--color-atomic-coolNeutral-97)] min-h-full pb-6">
      <div className="bg-white px-4 py-4">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          배달 내역
        </p>
      </div>

      {isLoading ? (
        <div className="mt-8 text-center text-body2 text-[var(--color-semantic-label-alternative)]">
          불러오는 중...
        </div>
      ) : history.length === 0 ? (
        <div className="mt-8 text-center text-body2 text-[var(--color-semantic-label-alternative)]">
          배달 내역이 없습니다.
        </div>
      ) : (
        <div className="mt-4">
          {Object.entries(groupedHistory).map(([date, items]) => (
            <div key={date} className="mb-4">
              <p className="px-4 mb-2 text-body3 font-semibold text-[var(--color-semantic-label-alternative)]">
                {date}
              </p>

              <div className="mx-4 rounded-xl bg-white overflow-hidden">
                {items.map((item, index) => (
                  <button
                    key={item.orderId}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 text-left ${
                      index < items.length - 1
                        ? 'border-b border-[var(--color-semantic-line-normal-normal)]'
                        : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] truncate">
                        {item.storeName}
                      </p>
                      <p className="mt-0.5 text-body3 text-[var(--color-semantic-label-alternative)] truncate">
                        {item.customerAddress}
                      </p>
                      <p className="mt-0.5 text-body3 text-[var(--color-semantic-label-alternative)]">
                        {formatTime(item.deliveryCompleteAt)}
                      </p>
                    </div>

                    <div className="ml-3 text-right">
                      <p className="text-body2 font-semibold text-[var(--color-atomic-redOrange-80)]">
                        +{item.deliveryFee.toLocaleString()}원
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
      )}

      {selectedItem && (
        <DeliveryDetailSheet
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
