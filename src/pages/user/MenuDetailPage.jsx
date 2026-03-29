import { useQuery } from '@tanstack/react-query';
import { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { getStoreDetail, getStoreMenus } from '@/shared/api';
import ArrowIcon from '@/shared/assets/icons/header/arrow.svg?react';
import BackIcon from '@/shared/assets/icons/header/back.svg?react';
import CheckIcon from '@/shared/assets/icons/header/check.svg?react';
import MinusIcon from '@/shared/assets/icons/header/minus.svg?react';
import PlusIcon from '@/shared/assets/icons/header/plus.svg?react';
import { useCartStore } from '@/shared/store';
import { BottomSheet, ConfirmModal } from '@/shared/ui';

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

function formatOptionPrice(amount, absolute) {
  if (typeof amount !== 'number') return '';
  if (absolute) return `${amount.toLocaleString('ko-KR')}원`;
  if (amount === 0) return '+0원';
  const prefix = amount > 0 ? '+' : '-';
  return `${prefix}${Math.abs(amount).toLocaleString('ko-KR')}원`;
}

function normalizeMenu(menu, index) {
  const rawMenuId = menu?.id ?? menu?.menuId ?? index + 1;
  const parsedMenuId = Number(rawMenuId);
  const menuNumericId = Number.isFinite(parsedMenuId) ? parsedMenuId : null;
  const rawStoreId = menu?.storeId ?? menu?.store?.id ?? null;
  const parsedStoreId = Number(rawStoreId);
  const storeIdNumeric = Number.isFinite(parsedStoreId) ? parsedStoreId : null;
  const optionGroups = Array.isArray(menu?.menuOptionGroups)
    ? menu.menuOptionGroups
    : [];

  return {
    id: String(rawMenuId),
    menuNumericId,
    storeIdNumeric,
    menuName: toMenuName(menu),
    menuDescription: menu?.menuDescription ?? menu?.description ?? '',
    priceAmount: toPriceAmount(menu?.price),
    reviewCount: menu?.reviewCount ?? 0,
    imageUrl: menu?.imageUrl ?? null,
    optionGroups: optionGroups.map((group, groupIndex) => ({
      id: group?.id ?? `${rawMenuId}-${groupIndex}`,
      groupName: group?.groupName ?? `옵션 그룹 ${groupIndex + 1}`,
      maxSelectableCount:
        typeof group?.maxSelectableCount === 'number'
          ? group.maxSelectableCount
          : null,
      absolutePrice: group?.absolutePrice ?? false,
      options: Array.isArray(group?.options)
        ? group.options.map((option, optionIndex) => ({
            id: `${group?.id ?? groupIndex}-${optionIndex}`,
            name: option?.name ?? '옵션',
            priceAmount: toPriceAmount(option?.optionPrice),
            isPopular: option?.isPopular ?? false,
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
  const location = useLocation();
  const editItemKey = location.state?.editItemKey ?? null;
  const addItem = useCartStore((state) => state.addItem);
  const replaceItem = useCartStore((state) => state.replaceItem);
  const cartItems = useCartStore((state) => state.items);
  const [pendingItemData, setPendingItemData] = useState(null);
  const existingItem = editItemKey
    ? cartItems.find((i) => i.itemKey === editItemKey)
    : null;
  const { storeId = '', menuId = '' } = useParams();
  const trimmedStoreId = storeId.trim();
  const trimmedMenuId = menuId.trim();
  const canFetch = isUuid(trimmedStoreId) && trimmedMenuId.length > 0;
  const [selectedByGroup, setSelectedByGroup] = useState(() => {
    if (!existingItem) return {};
    const restored = {};
    existingItem.selectedOptions.forEach((o) => {
      if (!restored[o.groupId]) restored[o.groupId] = [];
      restored[o.groupId].push(o.optionId);
    });
    return restored;
  });
  const [quantity, setQuantity] = useState(existingItem?.quantity ?? 1);
  const [toast, setToast] = useState('');
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const scrollRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
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
        if (menuError?.response?.status === 401) throw menuError;
      }

      return { store, menus, source };
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

  // 필수 그룹 첫번째 옵션 자동 선택 (렌더 중 파생)
  const effectiveSelectedByGroup = useMemo(() => {
    if (!selectedMenu) return selectedByGroup;
    const result = { ...selectedByGroup };
    selectedMenu.optionGroups.forEach((group) => {
      if (
        group.maxSelectableCount === 1 &&
        !result[group.id]?.length &&
        group.options.length > 0
      ) {
        result[group.id] = [group.options[0].id];
      }
    });
    return result;
  }, [selectedByGroup, selectedMenu]);

  const selectedOptions = useMemo(() => {
    if (!selectedMenu) return [];
    return selectedMenu.optionGroups.flatMap((group) => {
      const pickedIds = effectiveSelectedByGroup[group.id] ?? [];
      return group.options
        .filter((option) => pickedIds.includes(option.id))
        .map((option) => ({
          groupId: group.id,
          groupName: group.groupName,
          optionId: option.id,
          optionName: option.name,
          optionPriceAmount: option.priceAmount ?? 0,
          absolutePrice: group.absolutePrice,
        }));
    });
  }, [effectiveSelectedByGroup, selectedMenu]);

  // For absolute-price groups (size selection), total = selected option price
  // For relative groups, total = base price + sum of option prices
  const basePriceAmount = selectedMenu?.priceAmount ?? 0;

  const totalAmount = useMemo(() => {
    if (!selectedMenu) return 0;
    let base = basePriceAmount;

    selectedMenu.optionGroups.forEach((group) => {
      const pickedIds = effectiveSelectedByGroup[group.id] ?? [];
      group.options.forEach((option) => {
        if (!pickedIds.includes(option.id)) return;
        if (group.absolutePrice) {
          base = option.priceAmount ?? 0;
        } else {
          base += option.priceAmount ?? 0;
        }
      });
    });

    return base * quantity;
  }, [effectiveSelectedByGroup, selectedMenu, basePriceAmount, quantity]);

  const toggleOption = (group, option) => {
    setSelectedByGroup((prev) => {
      const currentIds = prev[group.id] ?? [];
      const isSelected = currentIds.includes(option.id);

      if (group.maxSelectableCount === 1) {
        if (isSelected) return prev;
        return { ...prev, [group.id]: [option.id] };
      }

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
        return prev;
      }

      return { ...prev, [group.id]: [...currentIds, option.id] };
    });
  };

  const addToCart = () => {
    const unselectedRequired = selectedMenu.optionGroups.find(
      (group) =>
        group.maxSelectableCount === 1 &&
        (effectiveSelectedByGroup[group.id] ?? []).length === 0
    );

    if (unselectedRequired) {
      showToast(`'${unselectedRequired.groupName}' 항목을 선택해 주세요.`);
      return;
    }
    const itemData = {
      storePublicId: trimmedStoreId,
      storeId: selectedMenu.storeIdNumeric,
      storeName: data?.store?.storeName ?? '가게명 없음',
      menuId: selectedMenu.id,
      menuNumericId: selectedMenu.menuNumericId,
      menuName: selectedMenu.menuName,
      menuDescription: selectedMenu.menuDescription,
      basePriceAmount,
      selectedOptions,
      quantity,
      deliveryFee: data?.store?.deliveryFee?.amount ?? 0,
      minimumOrderAmount: data?.store?.minimumOrderAmount?.amount ?? 0,
    };
    if (editItemKey) {
      replaceItem(editItemKey, itemData);
      navigate(-1);
      return;
    }

    const isDifferentStore =
      cartItems.length > 0 && cartItems[0].storePublicId !== trimmedStoreId;

    if (isDifferentStore) {
      setPendingItemData(itemData);
      return;
    }

    addItem(itemData);
    navigate(-1);
  };

  if (!canFetch) {
    return (
      <div className="py-6">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          잘못된 요청입니다.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-6">
        <p className="text-body1 text-[var(--color-semantic-label-normal)]">
          메뉴 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (isError) {
    const isUnauthorized = error?.response?.status === 401;
    return (
      <div className="py-6">
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
          {isUnauthorized && (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
            >
              로그인하러 가기
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!selectedMenu) {
    return (
      <div className="py-6">
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

  return (
    <div className="-mx-4 -mt-2 -mb-2 bg-white h-full flex flex-col min-h-0 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-[var(--color-semantic-label-normal)] text-white text-[13px] font-medium whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* Sticky header */}
      <div
        className={`absolute top-0 left-0 right-0 z-40 h-12 flex items-center px-4 transition-colors duration-200 ${isHeaderVisible ? 'bg-white' : 'bg-transparent'}`}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${isHeaderVisible ? '' : 'bg-white/80'}`}
        >
          <BackIcon className="size-5" />
        </button>
        {isHeaderVisible && (
          <span className="ml-3 text-[18px] font-bold text-[var(--color-semantic-label-normal)] truncate">
            {selectedMenu.menuName}
          </span>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        onScroll={() =>
          setIsHeaderVisible((scrollRef.current?.scrollTop ?? 0) > 100)
        }
      >
        <div className="min-h-full flex flex-col">
          {/* Hero image */}
          <div className="relative">
            <img
              src={selectedMenu.imageUrl ?? '/maratang1.png'}
              alt={selectedMenu.menuName}
              className="w-full h-[140px] object-cover"
            />
          </div>

          {/* Menu info */}
          <div className="px-4 pt-5 pb-5">
            <p className="text-[24px] font-bold text-[var(--color-semantic-label-normal)] line-clamp-2">
              {selectedMenu.menuName}
            </p>
            {selectedMenu.menuDescription && (
              <p className="mt-[2px] text-[16px] font-normal text-[var(--color-semantic-label-alternative)] leading-relaxed line-clamp-3">
                {selectedMenu.menuDescription}
              </p>
            )}
            {selectedMenu.reviewCount > 0 && (
              <button
                type="button"
                onClick={() => navigate(`/stores/${trimmedStoreId}/reviews`)}
                className="mt-[16px] flex items-center gap-0.5 text-[14px] font-bold text-[var(--color-semantic-label-normal)]"
              >
                <span>
                  리뷰 {selectedMenu.reviewCount.toLocaleString('ko-KR')}개
                </span>
                <ArrowIcon className="size-4 -rotate-90 [&_path]:fill-[var(--color-semantic-label-normal)] [&_path]:fill-opacity-100" />
              </button>
            )}
          </div>

          {/* Option groups */}
          {selectedMenu.optionGroups.map((group) => {
            const isRequired = group.maxSelectableCount === 1;
            const minGroupPrice = group.absolutePrice
              ? Math.min(...group.options.map((o) => o.priceAmount ?? 0))
              : 0;

            return (
              <div key={group.id}>
                <div className="h-[10px] bg-[var(--color-atomic-coolNeutral-97)]" />
                <div className="px-4 pt-5 pb-3">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)]">
                      {group.groupName}
                    </p>
                    <span
                      className={`text-[12px] px-[10px] py-1 rounded-full font-medium ${
                        isRequired
                          ? 'bg-[var(--color-semantic-label-normal)] text-white'
                          : 'border-[0.5px] border-[var(--color-atomic-coolNeutral-90)] text-[var(--color-semantic-label-alternative)]'
                      }`}
                    >
                      {isRequired ? '필수' : '선택'}
                    </span>
                  </div>

                  <ul>
                    {group.options.map((option) => {
                      const isSelected = (
                        effectiveSelectedByGroup[group.id] ?? []
                      ).includes(option.id);

                      return (
                        <li key={option.id}>
                          <button
                            type="button"
                            onClick={() => toggleOption(group, option)}
                            className="flex items-center gap-3 w-full py-[14px]"
                          >
                            {/* Radio / Checkbox indicator */}
                            {isRequired ? (
                              <div
                                className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected
                                    ? 'border-[var(--color-atomic-redOrange-80)]'
                                    : 'border-[var(--color-semantic-line-normal-normal)]'
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-[10px] h-[10px] rounded-full bg-[var(--color-atomic-redOrange-80)]" />
                                )}
                              </div>
                            ) : (
                              <div
                                className={`w-[20px] h-[20px] rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected
                                    ? 'bg-[var(--color-atomic-redOrange-80)] border-[var(--color-atomic-redOrange-80)]'
                                    : 'border-[var(--color-semantic-line-normal-normal)]'
                                }`}
                              >
                                {isSelected && (
                                  <CheckIcon className="size-3 [&_path]:fill-white" />
                                )}
                              </div>
                            )}

                            {/* Option name + popular badge */}
                            <span className="flex-1 flex items-center gap-[6px] text-left">
                              <span className="text-[15px] text-[var(--color-semantic-label-normal)]">
                                {option.name}
                              </span>
                              {option.isPopular && (
                                <span className="text-[11px] font-bold text-[var(--color-atomic-redOrange-80)] whitespace-nowrap">
                                  많이 팔린 메뉴
                                </span>
                              )}
                            </span>

                            {/* Price */}
                            <span className="text-[15px] font-bold text-[var(--color-semantic-label-normal)] whitespace-nowrap">
                              {group.absolutePrice
                                ? `+${((option.priceAmount ?? 0) - minGroupPrice).toLocaleString('ko-KR')}원`
                                : formatOptionPrice(option.priceAmount, false)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}

          {/* Quantity */}
          <div className="h-[10px] bg-[var(--color-atomic-coolNeutral-97)]" />
          <div className="px-4 py-5">
            <div className="flex items-center justify-between">
              <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)]">
                수량
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 border-[1px] border-[var(--color-atomic-coolNeutral-80)] rounded-[6px] flex items-center justify-center"
                >
                  <MinusIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-normal)]" />
                </button>
                <span className="text-[16px] font-bold text-[var(--color-semantic-label-normal)] min-w-[24px] text-center">
                  {quantity}개
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-8 h-8 border-[1px] border-[var(--color-atomic-coolNeutral-80)] rounded-[6px] flex items-center justify-center"
                >
                  <PlusIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-normal)]" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-[var(--color-atomic-coolNeutral-97)]" />
        </div>
      </div>
      {/* Bottom CTA */}
      <BottomSheet className="pb-3">
        <button
          type="button"
          onClick={addToCart}
          className="w-full h-[48px] rounded-2xl bg-[var(--color-atomic-redOrange-80)] text-white text-[18px] font-bold"
        >
          {formatAmount(totalAmount)} 담기
        </button>
      </BottomSheet>
      <ConfirmModal
        isOpen={!!pendingItemData}
        title="장바구니를 비울까요?"
        description="다른 가게 메뉴가 담겨있어요"
        confirmLabel="새로 담기"
        cancelLabel="취소"
        onConfirm={() => {
          addItem(pendingItemData);
          setPendingItemData(null);
          navigate(-1);
        }}
        onCancel={() => setPendingItemData(null)}
      />
    </div>
  );
}
