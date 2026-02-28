import { useNavigate } from 'react-router-dom';

import { useCartStore } from '@/shared/store';

function formatAmount(amount) {
  if (typeof amount !== 'number') return '-';
  return `${amount.toLocaleString('ko-KR')}원`;
}

function getItemUnitAmount(item) {
  const base =
    typeof item?.basePriceAmount === 'number' ? item.basePriceAmount : 0;
  const optionSum = (
    Array.isArray(item?.selectedOptions) ? item.selectedOptions : []
  ).reduce((acc, option) => acc + (option?.optionPriceAmount ?? 0), 0);
  return base + optionSum;
}

function getItemTotalAmount(item) {
  return getItemUnitAmount(item) * (item?.quantity ?? 0);
}

function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  onOpenMenu,
  onOpenStore,
}) {
  const selectedOptions = Array.isArray(item?.selectedOptions)
    ? item.selectedOptions
    : [];
  const unitAmount = getItemUnitAmount(item);
  const totalAmount = getItemTotalAmount(item);

  return (
    <li className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          {item?.menuName ?? '메뉴명 없음'}
        </p>
        <button
          type="button"
          onClick={() => onRemove(item.itemKey)}
          className="text-caption1 text-[var(--color-semantic-status-cautionary)]"
        >
          삭제
        </button>
      </div>

      <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
        {item?.storeName ?? '가게명 없음'}
      </p>

      {selectedOptions.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {selectedOptions.map((option, index) => (
            <li
              key={`${option?.groupId ?? index}-${option?.optionId ?? index}`}
              className="text-caption1 text-[var(--color-semantic-label-alternative)]"
            >
              {option?.groupName}: {option?.optionName} (
              {formatAmount(option?.optionPriceAmount ?? 0)})
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDecrease(item.itemKey)}
            className="h-8 w-8 rounded-md border border-[var(--color-semantic-line-normal-normal)]"
          >
            -
          </button>
          <span className="w-6 text-center text-body2 font-medium">
            {item?.quantity ?? 0}
          </span>
          <button
            type="button"
            onClick={() => onIncrease(item.itemKey)}
            className="h-8 w-8 rounded-md border border-[var(--color-semantic-line-normal-normal)]"
          >
            +
          </button>
        </div>

        <div className="text-right">
          <p className="text-caption1 text-[var(--color-semantic-label-alternative)]">
            단가 {formatAmount(unitAmount)}
          </p>
          <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
            {formatAmount(totalAmount)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onOpenStore(item?.storePublicId)}
          className="h-8 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-caption1"
        >
          가게로 이동
        </button>
        <button
          type="button"
          onClick={() => onOpenMenu(item?.storePublicId, item?.menuId)}
          className="h-8 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-caption1"
        >
          메뉴 상세
        </button>
      </div>
    </li>
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalAmount = items.reduce(
    (acc, item) => acc + getItemTotalAmount(item),
    0
  );
  const totalCount = items.reduce(
    (acc, item) => acc + (item?.quantity ?? 0),
    0
  );

  const openStore = (storePublicId) => {
    if (!storePublicId) return;
    navigate(`/stores/${storePublicId}`);
  };

  const openMenu = (storePublicId, menuId) => {
    if (!storePublicId || !menuId) return;
    navigate(`/stores/${storePublicId}/menu/${menuId}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-full bg-white px-4 py-8">
        <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
          장바구니
        </h1>
        <div className="mt-8 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] p-6 text-center">
          <p className="text-body1 font-medium text-[var(--color-semantic-label-normal)]">
            담긴 메뉴가 없습니다.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-3 h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white px-4 py-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
          장바구니
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-caption1 text-[var(--color-semantic-status-cautionary)]"
        >
          전체 비우기
        </button>
      </div>

      <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
        총 {totalCount}개
      </p>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <CartItem
            key={item.itemKey}
            item={item}
            onIncrease={incrementItem}
            onDecrease={decrementItem}
            onRemove={removeItem}
            onOpenMenu={openMenu}
            onOpenStore={openStore}
          />
        ))}
      </ul>

      <section className="mt-5 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] p-4">
        <div className="flex items-center justify-between">
          <p className="text-body2 text-[var(--color-semantic-label-alternative)]">
            총 결제 예상금액
          </p>
          <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            {formatAmount(totalAmount)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="mt-3 w-full h-10 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body2 font-semibold"
        >
          주문하기로 이동
        </button>
      </section>
    </div>
  );
}
