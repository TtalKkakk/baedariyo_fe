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
  return typeof value === 'number' ? value : 0;
}

export const useCartStore = create(
  devtools(
    persist(
      (set) => ({
        items: [],

        addItem: ({
          storePublicId,
          storeId,
          storeName,
          menuId,
          menuNumericId,
          menuName,
          menuDescription,
          basePriceAmount,
          selectedOptions = [],
          quantity = 1,
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

            const existingItem = state.items.find(
              (item) => item.itemKey === itemKey
            );

            if (existingItem) {
              return {
                items: state.items.map((item) =>
                  item.itemKey === itemKey
                    ? {
                        ...item,
                        quantity: item.quantity + safeQuantity,
                      }
                    : item
                ),
              };
            }

            return {
              items: [
                ...state.items,
                {
                  itemKey,
                  storePublicId,
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
            };
          }),

        incrementItem: (itemKey) =>
          set((state) => ({
            items: state.items.map((item) =>
              item.itemKey === itemKey
                ? { ...item, quantity: item.quantity + 1 }
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

        clearCart: () => set({ items: [] }),
      }),
      {
        name: 'cart-storage',
      }
    ),
    { name: 'CartStore' }
  )
);
