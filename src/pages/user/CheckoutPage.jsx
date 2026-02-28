import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { createOrder, getStoreMenus } from '@/shared/api';
import { useAddressBookStore, useCartStore } from '@/shared/store';

const PAYMENT_METHODS = [
  { value: 'CARD', label: '카드' },
  { value: 'KAKAO_PAY', label: '카카오페이' },
  { value: 'NAVER_PAY', label: '네이버페이' },
  { value: 'CASH', label: '현금' },
  { value: 'ETC', label: '기타' },
];

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function toMenuName(menu) {
  if (typeof menu?.menuName === 'string') return menu.menuName;
  if (typeof menu?.menuName?.value === 'string') return menu.menuName.value;
  if (typeof menu?.name === 'string') return menu.name;
  return '';
}

function toPriceAmount(price) {
  if (typeof price === 'number') return price;
  if (typeof price?.amount === 'number') return price.amount;
  return null;
}

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

function getStoreIdFromMenus(menus) {
  if (!Array.isArray(menus)) return null;

  for (const menu of menus) {
    const rawStoreId = menu?.storeId ?? menu?.store?.id;
    const parsedStoreId = Number(rawStoreId);
    if (isPositiveInteger(parsedStoreId)) return parsedStoreId;
  }

  return null;
}

function getMenuIdFromMenus(menus, item) {
  if (!Array.isArray(menus) || menus.length === 0) return null;

  const normalizedMenuName = item?.menuName ?? '';
  const baseAmount =
    typeof item?.basePriceAmount === 'number' ? item.basePriceAmount : null;
  const unitAmount = getItemUnitAmount(item);

  const byName = menus.filter(
    (menu) => toMenuName(menu) === normalizedMenuName
  );
  const byNameAndPrice = byName.find((menu) => {
    const amount = toPriceAmount(menu?.price);
    return amount === baseAmount || amount === unitAmount;
  });
  const target = byNameAndPrice ?? byName[0] ?? menus[0];

  const parsedMenuId = Number(target?.id ?? target?.menuId);
  return isPositiveInteger(parsedMenuId) ? parsedMenuId : null;
}

function getOrderErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '주문 생성에 실패했습니다.'
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const addresses = useAddressBookStore((state) => state.addresses);
  const defaultAddressId = useAddressBookStore(
    (state) => state.defaultAddressId
  );
  const selectedAddressId = location.state?.selectedAddressId ?? null;
  const defaultAddress = useMemo(
    () => addresses.find((item) => item.id === defaultAddressId) ?? null,
    [addresses, defaultAddressId]
  );
  const selectedAddress = useMemo(() => {
    if (!selectedAddressId) return defaultAddress;
    return (
      addresses.find((item) => item.id === selectedAddressId) ?? defaultAddress
    );
  }, [addresses, defaultAddress, selectedAddressId]);

  const [roadAddress, setRoadAddress] = useState(
    selectedAddress?.roadAddress ?? ''
  );
  const [jibunAddress, setJibunAddress] = useState(
    selectedAddress?.jibunAddress ?? ''
  );
  const [detailAddress, setDetailAddress] = useState(
    selectedAddress?.detailAddress ?? ''
  );
  const [storeRequest, setStoreRequest] = useState('');
  const [riderRequest, setRiderRequest] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');

  const uniqueStorePublicIds = useMemo(
    () => [
      ...new Set(
        items
          .map((item) => item?.storePublicId)
          .filter((storePublicId) => typeof storePublicId === 'string')
      ),
    ],
    [items]
  );

  const totalAmount = items.reduce(
    (acc, item) => acc + getItemUnitAmount(item) * (item?.quantity ?? 0),
    0
  );

  const applyDefaultAddress = () => {
    if (!defaultAddress) return;

    setRoadAddress(defaultAddress.roadAddress ?? '');
    setJibunAddress(defaultAddress.jibunAddress ?? '');
    setDetailAddress(defaultAddress.detailAddress ?? '');
  };

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (items.length === 0) {
        throw new Error('장바구니가 비어 있습니다.');
      }

      if (uniqueStorePublicIds.length !== 1) {
        throw new Error('현재는 한 가게의 메뉴만 주문할 수 있습니다.');
      }

      const targetStorePublicId = uniqueStorePublicIds[0];
      let storeMenus = [];

      try {
        const response = await getStoreMenus(targetStorePublicId);
        storeMenus = Array.isArray(response) ? response : [];
      } catch (menuError) {
        if (menuError?.response?.status === 401) {
          throw menuError;
        }
      }

      const storeIdFromCart = items.find((item) =>
        isPositiveInteger(item?.storeId)
      )?.storeId;
      const resolvedStoreId =
        storeIdFromCart ?? getStoreIdFromMenus(storeMenus) ?? null;

      if (!isPositiveInteger(resolvedStoreId)) {
        throw new Error(
          'storeId를 확인할 수 없습니다. /api/stores/{storePublicId}/menus 응답에 store.id가 필요합니다.'
        );
      }

      const menus = items.map((item) => {
        const menuIdCandidates = [
          Number(item?.menuNumericId),
          Number(item?.menuId),
          getMenuIdFromMenus(storeMenus, item),
        ];
        const resolvedMenuId =
          menuIdCandidates.find((candidate) => isPositiveInteger(candidate)) ??
          null;

        if (!isPositiveInteger(resolvedMenuId)) {
          throw new Error(
            `menuId를 확인할 수 없습니다: ${item?.menuName ?? '알 수 없는 메뉴'}`
          );
        }

        return {
          menuId: resolvedMenuId,
          menuName: item?.menuName ?? '메뉴',
          menuPrice: getItemUnitAmount(item),
          quantity: item?.quantity ?? 1,
        };
      });

      return createOrder({
        storeId: resolvedStoreId,
        menus,
        storeRequest: storeRequest.trim(),
        riderRequest: riderRequest.trim(),
        deliveryAddress: {
          roadAddress: roadAddress.trim(),
          jibunAddress: jibunAddress.trim(),
          detailAddress: detailAddress.trim(),
        },
        paymentMethod,
      });
    },
    onSuccess: () => {
      clearCart();
      navigate('/orders');
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();
    createOrderMutation.mutate();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-full bg-white px-4 py-8">
        <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
          주문하기
        </h1>
        <div className="mt-8 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] p-6 text-center">
          <p className="text-body1 font-medium text-[var(--color-semantic-label-normal)]">
            주문할 메뉴가 없습니다.
          </p>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="mt-3 h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium"
          >
            장바구니로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white px-4 py-4 pb-8">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        주문하기
      </h1>

      {uniqueStorePublicIds.length !== 1 ? (
        <p className="mt-2 text-body3 text-[var(--color-semantic-status-cautionary)]">
          현재는 한 가게의 메뉴만 주문할 수 있습니다. 장바구니를 정리해 주세요.
        </p>
      ) : null}

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] p-4">
        <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          주문 메뉴
        </h2>
        <ul className="mt-2 space-y-1">
          {items.map((item) => (
            <li
              key={item.itemKey}
              className="flex items-center justify-between text-body3"
            >
              <span className="text-[var(--color-semantic-label-normal)]">
                {item.menuName} x{item.quantity}
              </span>
              <span className="text-[var(--color-semantic-label-alternative)]">
                {formatAmount(getItemUnitAmount(item) * (item?.quantity ?? 0))}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 pt-3 border-t border-[var(--color-semantic-line-normal-normal)] flex items-center justify-between">
          <span className="text-body2 text-[var(--color-semantic-label-alternative)]">
            총 결제금액
          </span>
          <span className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            {formatAmount(totalAmount)}
          </span>
        </div>
      </section>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <section className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4">
          <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            배달 주소
          </h2>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={applyDefaultAddress}
              disabled={!defaultAddress}
              className="h-8 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-caption1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              기본 주소 불러오기
            </button>
            <button
              type="button"
              onClick={() => navigate('/mypage/addresses')}
              className="h-8 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-caption1"
            >
              주소 관리
            </button>
          </div>
          {selectedAddress ? (
            <p className="mt-2 text-caption1 text-[var(--color-semantic-label-alternative)]">
              선택 주소: {selectedAddress.label}
            </p>
          ) : null}
          <div className="mt-2 space-y-2">
            <input
              type="text"
              value={roadAddress}
              onChange={(event) => setRoadAddress(event.target.value)}
              placeholder="도로명 주소"
              className="w-full h-10 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3 outline-none"
              required
            />
            <input
              type="text"
              value={jibunAddress}
              onChange={(event) => setJibunAddress(event.target.value)}
              placeholder="지번 주소"
              className="w-full h-10 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3 outline-none"
              required
            />
            <input
              type="text"
              value={detailAddress}
              onChange={(event) => setDetailAddress(event.target.value)}
              placeholder="상세 주소"
              className="w-full h-10 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3 outline-none"
              required
            />
          </div>
        </section>

        <section className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4">
          <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            요청사항
          </h2>
          <div className="mt-2 space-y-2">
            <textarea
              value={storeRequest}
              onChange={(event) => setStoreRequest(event.target.value)}
              placeholder="가게 요청사항"
              className="w-full min-h-20 px-3 py-2 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3 outline-none resize-y"
            />
            <textarea
              value={riderRequest}
              onChange={(event) => setRiderRequest(event.target.value)}
              placeholder="라이더 요청사항"
              className="w-full min-h-20 px-3 py-2 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body3 outline-none resize-y"
            />
          </div>
        </section>

        <section className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] p-4">
          <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            결제 수단
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => setPaymentMethod(method.value)}
                className={`h-8 px-3 rounded-full border text-body3 ${
                  paymentMethod === method.value
                    ? 'border-[var(--color-atomic-redOrange-80)] bg-[var(--color-atomic-redOrange-99)] text-[var(--color-semantic-status-cautionary)]'
                    : 'border-[var(--color-semantic-line-normal-normal)] text-[var(--color-semantic-label-alternative)]'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </section>

        {createOrderMutation.isError ? (
          <p className="text-body3 text-[var(--color-semantic-status-cautionary)]">
            {getOrderErrorMessage(createOrderMutation.error)}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={
            createOrderMutation.isPending || uniqueStorePublicIds.length !== 1
          }
          className="w-full h-11 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body1 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {createOrderMutation.isPending ? '주문 생성 중...' : '주문 생성'}
        </button>
      </form>
    </div>
  );
}
