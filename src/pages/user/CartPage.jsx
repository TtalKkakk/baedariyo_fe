import { useNavigate } from 'react-router-dom';

import { useCartStore } from '@/shared/store';
import { BottomSheet } from '@/shared/ui';
import ArrowIcon from '@/shared/assets/icons/header/arrow.svg?react';
import MinusIcon from '@/shared/assets/icons/header/minus.svg?react';
import PlusIcon from '@/shared/assets/icons/header/plus.svg?react';
import DeleteIcon from '@/shared/assets/icons/cart/delete.svg?react';
import MenuPlusIcon from '@/shared/assets/icons/cart/menuplus.svg?react';

function formatAmount(amount) {
  if (typeof amount !== 'number') return '-';
  return `${amount.toLocaleString('ko-KR')}원`;
}

function getItemUnitAmount(item) {
  const base =
    typeof item?.basePriceAmount === 'number' ? item.basePriceAmount : 0;
  const optionSum = (
    Array.isArray(item?.selectedOptions) ? item.selectedOptions : []
  ).reduce((acc, o) => acc + (o?.optionPriceAmount ?? 0), 0);
  return base + optionSum;
}

export default function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const deliveryFee = useCartStore((state) => state.deliveryFee);
  const minimumOrderAmount = useCartStore((state) => state.minimumOrderAmount);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const storePublicId = items[0]?.storePublicId ?? '';
  const storeName = items[0]?.storeName ?? '가게명 없음';

  const orderAmount = items.reduce(
    (acc, item) => acc + getItemUnitAmount(item) * (item?.quantity ?? 0),
    0
  );
  const totalAmount = orderAmount + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="-mx-4 -mt-2 -mb-2 bg-white h-full flex flex-col items-center justify-center gap-3">
        <p className="text-[16px] font-medium text-[var(--color-semantic-label-alternative)]">
          담긴 메뉴가 없습니다.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="h-10 px-5 rounded-xl bg-[var(--color-atomic-redOrange-80)] text-white text-[14px] font-bold"
        >
          홈으로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="-mx-4 -mt-2 -mb-2 bg-white h-full flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex flex-col">
          {/* Store info */}
          <div className="bg-white px-4 py-4 flex items-center gap-3">
            <img
              src={items[0]?.storeThumbnailUrl ?? '/maratang1.png'}
              alt={storeName}
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
            <p className="flex-1 min-w-0 text-[20px] font-bold text-[var(--color-semantic-label-normal)] truncate">
              {storeName}
            </p>
            <button
              type="button"
              onClick={() => navigate(`/stores/${storePublicId}`)}
            >
              <ArrowIcon className="size-5 -rotate-90 [&_path]:fill-[var(--color-semantic-label-normal)]" />
            </button>
          </div>

          {/* Menu items */}
          <div className="mx-4 border-t border-[var(--color-semantic-line-normal-normal)]" />
          <div className="bg-white">
            {items.map((item, index) => {
              const unitAmount = getItemUnitAmount(item);
              const itemTotal = unitAmount * (item?.quantity ?? 0);

              return (
                <div key={item.itemKey}>
                  {index > 0 && (
                    <div className="mx-4 border-t border-[var(--color-semantic-line-normal-normal)]" />
                  )}
                  <div className="px-4 pt-4 pb-[16px]">
                    {/* Name + 옵션변경 */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)] leading-tight">
                        {item.menuName}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/stores/${storePublicId}/menu/${item.menuId}`,
                            { state: { editItemKey: item.itemKey } }
                          )
                        }
                        className="shrink-0 px-3 h-7 rounded-full bg-[var(--color-atomic-coolNeutral-97)] text-[12px] font-medium text-[var(--color-semantic-label-alternative)] whitespace-nowrap"
                      >
                        옵션변경
                      </button>
                    </div>

                    {/* Option text */}
                    {item.selectedOptions?.length > 0 && (
                      <div className="mt-[6.5px] space-y-[2px]">
                        {item.selectedOptions.map((o, i) => (
                          <p
                            key={i}
                            className="text-[13px] text-[var(--color-semantic-label-alternative)]"
                          >
                            {o.groupName} : {o.optionName}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Price + quantity */}
                    <div className="flex items-center justify-between mt-5">
                      <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)]">
                        {formatAmount(itemTotal)}
                      </p>
                      <div className="flex items-center gap-[8px]">
                        <button
                          type="button"
                          onClick={() => {
                            if ((item?.quantity ?? 0) <= 1)
                              removeItem(item.itemKey);
                            else decrementItem(item.itemKey);
                          }}
                          className="w-8 h-8 border-[0.5px] border-[var(--color-atomic-coolNeutral-80)] rounded-[6px] flex items-center justify-center"
                        >
                          {(item?.quantity ?? 0) <= 1 ? (
                            <DeleteIcon className="size-4 [&_path]:fill-[var(--color-semantic-label-normal)]" />
                          ) : (
                            <MinusIcon className="size-4 [&_path]:fill-[var(--color-semantic-label-normal)]" />
                          )}
                        </button>
                        <span className="text-[18px] font-bold text-[var(--color-semantic-label-normal)] min-w-[20px] text-center">
                          {item?.quantity ?? 0}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementItem(item.itemKey)}
                          className="w-8 h-8 border-[0.5px] border-[var(--color-atomic-coolNeutral-80)] rounded-[6px] flex items-center justify-center"
                        >
                          <PlusIcon className="size-4 [&_path]:fill-[var(--color-semantic-label-normal)]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="mx-4 border-t border-[var(--color-semantic-line-normal-normal)]" />
          <div className="bg-white px-4 pt-[16px] pb-5 space-y-[6px]">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[var(--color-semantic-label-alternative)]">
                주문 금액
              </span>
              <span className="text-[14px] text-[var(--color-semantic-label-normal)]">
                {formatAmount(orderAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[var(--color-semantic-label-alternative)]">
                배달비
              </span>
              <span className="text-[14px] text-[var(--color-semantic-label-normal)]">
                {formatAmount(deliveryFee)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-[var(--color-semantic-label-normal)]">
                결제 금액
              </span>
              <span className="text-[14px] font-bold text-[var(--color-atomic-redOrange-80)]">
                {formatAmount(totalAmount)}
              </span>
            </div>
          </div>

          {/* 메뉴추가 */}
          <div className="mt-8 mx-4 border-t border-[var(--color-semantic-line-normal-normal)]" />
          <div className="bg-white py-[30px] flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/stores/${storePublicId}`)}
              className="flex items-center gap-2 text-[18px] font-medium text-[var(--color-semantic-label-normal)]"
            >
              <MenuPlusIcon className="size-6" />
              메뉴추가
            </button>
          </div>

          <div className="flex-1 bg-[var(--color-atomic-coolNeutral-97)]" />
        </div>
      </div>

      {/* Bottom CTA */}
      <BottomSheet className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-medium text-[var(--color-semantic-label-alternative)]">
            결제예정금액
          </span>
          <p className="text-[24px] font-bold text-[var(--color-semantic-label-normal)]">
            {formatAmount(totalAmount)}
          </p>
        </div>
        {minimumOrderAmount > 0 && orderAmount < minimumOrderAmount && (
          <p className="text-[13px] text-center text-[var(--color-semantic-status-negative)] mb-2">
            <span className="font-bold">
              {formatAmount(minimumOrderAmount - orderAmount)}
            </span>{' '}
            더 담으면 주문 가능해요
          </p>
        )}
        <button
          type="button"
          onClick={() => navigate('/checkout')}
          disabled={minimumOrderAmount > 0 && orderAmount < minimumOrderAmount}
          className="w-[328px] h-[48px] rounded-[10px] text-white text-[18px] font-bold disabled:bg-[var(--color-atomic-coolNeutral-80)] bg-[var(--color-atomic-redOrange-80)]"
        >
          주문하기
        </button>
      </BottomSheet>
    </div>
  );
}
