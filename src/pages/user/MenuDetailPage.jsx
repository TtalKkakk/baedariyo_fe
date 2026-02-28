import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getStoreDetail, getStoreMenus } from '@/shared/api';
import { useCartStore } from '@/shared/store';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return UUID_REGEX.test(value);
}

function toMenuName(menu) {
  if (typeof menu?.menuName === 'string') return menu.menuName;
  if (typeof menu?.menuName?.value === 'string') return menu.menuName.value;
  if (typeof menu?.name === 'string') return menu.name;
  return '이름 없음';
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

function formatOptionPrice(amount) {
  if (typeof amount !== 'number' || amount === 0) return '무료';
  const prefix = amount > 0 ? '+' : '-';
  return `${prefix}${Math.abs(amount).toLocaleString('ko-KR')}원`;
}

function normalizeMenu(menu, index) {
  const menuId = menu?.id ?? menu?.menuId ?? index + 1;
  const optionGroups = Array.isArray(menu?.menuOptionGroups)
    ? menu.menuOptionGroups
    : [];

  return {
    id: String(menuId),
    menuName: toMenuName(menu),
    menuDescription: menu?.menuDescription ?? menu?.description ?? '',
    priceAmount: toPriceAmount(menu?.price),
    optionGroups: optionGroups.map((group, groupIndex) => ({
      id: group?.id ?? `${menuId}-${groupIndex}`,
      groupName: group?.groupName ?? `옵션 그룹 ${groupIndex + 1}`,
      maxSelectableCount:
        typeof group?.maxSelectableCount === 'number'
          ? group.maxSelectableCount
          : null,
      options: Array.isArray(group?.options)
        ? group.options.map((option, optionIndex) => ({
            id: `${group?.id ?? groupIndex}-${optionIndex}`,
            name: option?.name ?? '옵션',
            priceAmount: toPriceAmount(option?.optionPrice),
          }))
        : [],
    })),
  };
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '메뉴 정보를 불러오지 못했습니다.'
  );
}

export default function MenuDetailPage() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { storeId = '', menuId = '' } = useParams();
  const trimmedStoreId = storeId.trim();
  const trimmedMenuId = menuId.trim();
  const canFetch = isUuid(trimmedStoreId) && trimmedMenuId.length > 0;
  const [selectedByGroup, setSelectedByGroup] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectionError, setSelectionError] = useState('');
  const [addFeedback, setAddFeedback] = useState('');

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['store-menu-detail', trimmedStoreId],
    queryFn: async () => {
      const store = await getStoreDetail(trimmedStoreId);
      let menus = Array.isArray(store?.menus) ? store.menus : [];
      let source = 'store-detail';

      try {
        const storeMenus = await getStoreMenus(trimmedStoreId);
        if (Array.isArray(storeMenus) && storeMenus.length > 0) {
          menus = storeMenus;
          source = 'store-menus';
        }
      } catch (menuError) {
        if (menuError?.response?.status === 401) {
          throw menuError;
        }
      }

      return {
        store,
        menus,
        source,
      };
    },
    enabled: canFetch,
    retry: 1,
  });

  const normalizedMenus = (Array.isArray(data?.menus) ? data.menus : []).map(
    (menu, index) => normalizeMenu(menu, index)
  );

  const menuIndex = Number(trimmedMenuId) - 1;
  const selectedMenu =
    normalizedMenus.find((menu) => menu.id === trimmedMenuId) ??
    (Number.isInteger(menuIndex) && menuIndex >= 0
      ? normalizedMenus[menuIndex]
      : null);

  const selectedOptions = useMemo(() => {
    if (!selectedMenu) return [];

    return selectedMenu.optionGroups.flatMap((group) => {
      const pickedIds = selectedByGroup[group.id] ?? [];
      return group.options
        .filter((option) => pickedIds.includes(option.id))
        .map((option) => ({
          groupId: group.id,
          groupName: group.groupName,
          optionId: option.id,
          optionName: option.name,
          optionPriceAmount: option.priceAmount ?? 0,
        }));
    });
  }, [selectedByGroup, selectedMenu]);

  const selectedOptionTotal = selectedOptions.reduce(
    (acc, option) => acc + (option.optionPriceAmount ?? 0),
    0
  );
  const basePriceAmount = selectedMenu?.priceAmount ?? 0;
  const unitTotal = basePriceAmount + selectedOptionTotal;
  const totalAmount = unitTotal * quantity;

  if (!selectedMenu) {
    return (
      <div className="px-4 py-6">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          메뉴를 찾을 수 없습니다.
        </p>
        <button
          type="button"
          onClick={() => navigate(`/stores/${trimmedStoreId}`)}
          className="mt-3 h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
        >
          가게 상세로 이동
        </button>
      </div>
    );
  }

  const toggleOption = (group, option) => {
    setSelectionError('');
    setAddFeedback('');

    setSelectedByGroup((prev) => {
      const currentIds = prev[group.id] ?? [];
      const isSelected = currentIds.includes(option.id);

      if (isSelected) {
        return {
          ...prev,
          [group.id]: currentIds.filter((id) => id !== option.id),
        };
      }

      const maxSelectable = group.maxSelectableCount;
      if (
        typeof maxSelectable === 'number' &&
        maxSelectable > 0 &&
        currentIds.length >= maxSelectable
      ) {
        setSelectionError(
          `${group.groupName}은(는) 최대 ${maxSelectable}개까지 선택할 수 있습니다.`
        );
        return prev;
      }

      return {
        ...prev,
        [group.id]: [...currentIds, option.id],
      };
    });
  };

  const onIncreaseQuantity = () => {
    setAddFeedback('');
    setQuantity((prev) => prev + 1);
  };

  const onDecreaseQuantity = () => {
    setAddFeedback('');
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const addToCart = () => {
    addItem({
      storePublicId: trimmedStoreId,
      storeName: data?.store?.storeName ?? '가게명 없음',
      menuId: selectedMenu.id,
      menuName: selectedMenu.menuName,
      menuDescription: selectedMenu.menuDescription,
      basePriceAmount,
      selectedOptions,
      quantity,
    });

    setAddFeedback('장바구니에 담았습니다.');
  };

  if (!canFetch) {
    return (
      <div className="px-4 py-6">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          잘못된 요청입니다.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <p className="text-body1 text-[var(--color-semantic-label-normal)]">
          메뉴 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (isError) {
    const isUnauthorized = error?.response?.status === 401;

    return (
      <div className="px-4 py-6">
        <p className="text-body1 font-semibold text-[var(--color-semantic-status-cautionary)]">
          {getErrorMessage(error)}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
          >
            다시 시도
          </button>
          {isUnauthorized ? (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
            >
              로그인하러 가기
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white px-4 py-4 pb-8">
      <p className="text-caption1 text-[var(--color-semantic-label-alternative)]">
        {isFetching
          ? '최신 데이터 동기화 중...'
          : data?.source === 'store-menus'
            ? '메뉴 API 동기화 완료'
            : '가게 상세 API 메뉴 데이터 사용'}
      </p>

      <h1 className="mt-1 text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        {selectedMenu.menuName}
      </h1>
      <p className="mt-1 text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
        {formatAmount(selectedMenu.priceAmount)}
      </p>
      <p className="mt-2 text-body3 text-[var(--color-semantic-label-alternative)]">
        {selectedMenu.menuDescription || '메뉴 설명이 없습니다.'}
      </p>

      <section className="mt-5 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] p-4">
        <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
          가게
        </p>
        <p className="mt-1 text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          {data?.store?.storeName ?? '가게명 없음'}
        </p>
      </section>

      <section className="mt-5">
        <h2 className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          옵션 그룹
        </h2>
        {selectionError ? (
          <p className="mt-2 text-body3 text-[var(--color-semantic-status-cautionary)]">
            {selectionError}
          </p>
        ) : null}
        {selectedMenu.optionGroups.length === 0 ? (
          <p className="mt-2 text-body3 text-[var(--color-semantic-label-alternative)]">
            옵션이 없습니다.
          </p>
        ) : (
          <ul className="mt-2 space-y-3">
            {selectedMenu.optionGroups.map((group) => (
              <li
                key={group.id}
                className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-3"
              >
                <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
                  {group.groupName}
                </p>
                {typeof group.maxSelectableCount === 'number' ? (
                  <p className="mt-0.5 text-caption1 text-[var(--color-semantic-label-alternative)]">
                    최대 선택 {group.maxSelectableCount}개
                  </p>
                ) : null}

                {group.options.length === 0 ? (
                  <p className="mt-2 text-body3 text-[var(--color-semantic-label-alternative)]">
                    선택 가능한 옵션이 없습니다.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {group.options.map((option) => (
                      <li key={option.id}>
                        <button
                          type="button"
                          onClick={() => toggleOption(group, option)}
                          className={`w-full flex items-center justify-between rounded-md px-2 py-1.5 text-body3 border ${
                            (selectedByGroup[group.id] ?? []).includes(
                              option.id
                            )
                              ? 'border-[var(--color-atomic-redOrange-80)] bg-[var(--color-atomic-redOrange-99)] text-[var(--color-semantic-status-cautionary)]'
                              : 'border-[var(--color-semantic-line-normal-normal)] text-[var(--color-semantic-label-normal)]'
                          }`}
                        >
                          <span>{option.name}</span>
                          <span>{formatOptionPrice(option.priceAmount)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-5 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] p-4">
        <div className="flex items-center justify-between">
          <p className="text-body3 text-[var(--color-semantic-label-alternative)]">
            수량
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDecreaseQuantity}
              className="h-8 w-8 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2"
            >
              -
            </button>
            <span className="w-6 text-center text-body2 font-medium">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncreaseQuantity}
              className="h-8 w-8 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-body2 text-[var(--color-semantic-label-alternative)]">
            총 금액
          </p>
          <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
            {formatAmount(totalAmount)}
          </p>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={addToCart}
            className="h-10 px-4 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body2 font-semibold"
          >
            장바구니 담기
          </button>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="h-10 px-4 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
          >
            장바구니 보기
          </button>
        </div>

        {addFeedback ? (
          <p className="mt-2 text-body3 text-[var(--color-atomic-blue-65)]">
            {addFeedback}
          </p>
        ) : null}
      </section>
    </div>
  );
}
