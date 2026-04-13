import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

function buildOptionSignature(selectedOptions) {
  return [...selectedOptions]
    .map(
      (option) =>
        `${option.groupId}:${option.optionName}:${option.optionPriceAmount ?? 0}`
    )
    .sort()
    .join('|');
}

function toSafeNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

export const useCartStore = create(
  devtools(
    persist(
      (set) => ({
        items: [],
        deliveryFee: 0,
        minimumOrderAmount: 0,

        addItem: ({
          storePublicId,
          storeId,
          storeName,
          storeThumbnailUrl,
          menuId,
          menuNumericId,
          menuName,
          menuDescription,
          basePriceAmount,
          selectedOptions = [],
          quantity = 1,
          deliveryFee = 0,
          minimumOrderAmount = 0,
        }) =>
          set((state) => {
            const safeQuantity = Math.max(1, quantity);
            const normalizedOptions = selectedOptions.map((option) => ({
              groupId: option.groupId,
              groupName: option.groupName,
              optionId: option.optionId,
              optionName: option.optionName,
              optionPriceAmount: toSafeNumber(option.optionPriceAmount),
            }));

            const optionSignature = buildOptionSignature(normalizedOptions);
            const itemKey = `${storePublicId}:${menuId}:${optionSignature}`;

            // 다른 가게면 장바구니 초기화
            const isDifferentStore =
              state.items.length > 0 &&
              state.items[0].storePublicId !== storePublicId;
            const baseItems = isDifferentStore ? [] : state.items;

            const existingItem = baseItems.find(
              (item) => item.itemKey === itemKey
            );

            if (existingItem) {
              return {
                items: baseItems.map((item) =>
                  item.itemKey === itemKey
                    ? { ...item, quantity: item.quantity + safeQuantity }
                    : item
                ),
                deliveryFee: toSafeNumber(deliveryFee),
                minimumOrderAmount: toSafeNumber(minimumOrderAmount),
              };
            }

            return {
              items: [
                ...baseItems,
                {
                  itemKey,
                  storePublicId,
                  storeThumbnailUrl: storeThumbnailUrl ?? null,
                  storeId:
                    typeof storeId === 'number' && Number.isFinite(storeId)
                      ? storeId
                      : null,
                  storeName,
                  menuId,
                  menuNumericId:
                    typeof menuNumericId === 'number' &&
                    Number.isFinite(menuNumericId)
                      ? menuNumericId
                      : null,
                  menuName,
                  menuDescription,
                  basePriceAmount: toSafeNumber(basePriceAmount),
                  selectedOptions: normalizedOptions,
                  quantity: safeQuantity,
                },
              ],
              deliveryFee: toSafeNumber(deliveryFee),
              minimumOrderAmount: toSafeNumber(minimumOrderAmount),
            };
          }),

        incrementItem: (itemKey) =>
          set((state) => ({
            items: state.items.map((item) =>
              item.itemKey === itemKey
                ? { ...item, quantity: Math.min(99, item.quantity + 1) }
                : item
            ),
          })),

        decrementItem: (itemKey) =>
          set((state) => ({
            items: state.items
              .map((item) =>
                item.itemKey === itemKey
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              )
              .filter((item) => item.quantity > 0),
          })),

        removeItem: (itemKey) =>
          set((state) => ({
            items: state.items.filter((item) => item.itemKey !== itemKey),
          })),

        replaceItem: (oldItemKey, newItemData) =>
          set((state) => {
            const safeQuantity = Math.max(1, newItemData.quantity ?? 1);
            const normalizedOptions = (newItemData.selectedOptions ?? []).map(
              (option) => ({
                groupId: option.groupId,
                groupName: option.groupName,
                optionId: option.optionId,
                optionName: option.optionName,
                optionPriceAmount: toSafeNumber(option.optionPriceAmount),
              })
            );
            const optionSignature = buildOptionSignature(normalizedOptions);
            const newItemKey = `${newItemData.storePublicId}:${newItemData.menuId}:${optionSignature}`;

            // 변경된 옵션이 이미 다른 아이템과 key 충돌 → 수량 합산 후 기존 제거
            const isDuplicate =
              newItemKey !== oldItemKey &&
              state.items.some((item) => item.itemKey === newItemKey);

            if (isDuplicate) {
              return {
                items: state.items
                  .filter((item) => item.itemKey !== oldItemKey)
                  .map((item) =>
                    item.itemKey === newItemKey
                      ? { ...item, quantity: item.quantity + safeQuantity }
                      : item
                  ),
              };
            }

            return {
              items: state.items.map((item) =>
                item.itemKey === oldItemKey
                  ? {
                      ...item,
                      ...newItemData,
                      itemKey: newItemKey,
                      selectedOptions: normalizedOptions,
                      quantity: safeQuantity,
                      basePriceAmount: toSafeNumber(
                        newItemData.basePriceAmount
                      ),
                      storeId:
                        typeof newItemData.storeId === 'number' &&
                        Number.isFinite(newItemData.storeId)
                          ? newItemData.storeId
                          : item.storeId,
                    }
                  : item
              ),
            };
          }),

        clearCart: () =>
          set({ items: [], deliveryFee: 0, minimumOrderAmount: 0 }),
      }),
      {
        name: 'cart-storage',
        version: 1,
        migrate: () => ({ items: [], deliveryFee: 0, minimumOrderAmount: 0 }),
      }
    ),
    { name: 'CartStore' }
  )
);
