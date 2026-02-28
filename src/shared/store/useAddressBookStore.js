import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

function createAddressId() {
  return `addr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useAddressBookStore = create(
  devtools(
    persist(
      (set) => ({
        addresses: [],
        defaultAddressId: null,

        addAddress: ({
          label,
          recipientName,
          phoneNumber,
          roadAddress,
          jibunAddress,
          detailAddress,
          isDefault = false,
        }) =>
          set((state) => {
            const nextAddress = {
              id: createAddressId(),
              label: label?.trim() || '기본 주소',
              recipientName: recipientName?.trim() || '',
              phoneNumber: phoneNumber?.trim() || '',
              roadAddress: roadAddress?.trim() || '',
              jibunAddress: jibunAddress?.trim() || '',
              detailAddress: detailAddress?.trim() || '',
              createdAt: new Date().toISOString(),
            };

            const nextAddresses = [...state.addresses, nextAddress];
            const nextDefaultAddressId =
              state.defaultAddressId === null || isDefault
                ? nextAddress.id
                : state.defaultAddressId;

            return {
              addresses: nextAddresses,
              defaultAddressId: nextDefaultAddressId,
            };
          }),

        setDefaultAddress: (addressId) =>
          set((state) => {
            const exists = state.addresses.some(
              (item) => item.id === addressId
            );
            if (!exists) return state;
            return { defaultAddressId: addressId };
          }),

        removeAddress: (addressId) =>
          set((state) => {
            const nextAddresses = state.addresses.filter(
              (item) => item.id !== addressId
            );
            const nextDefaultAddressId =
              state.defaultAddressId === addressId
                ? (nextAddresses[0]?.id ?? null)
                : state.defaultAddressId;

            return {
              addresses: nextAddresses,
              defaultAddressId: nextDefaultAddressId,
            };
          }),

        clearAddresses: () =>
          set({
            addresses: [],
            defaultAddressId: null,
          }),
      }),
      { name: 'address-book-storage' }
    ),
    { name: 'AddressBookStore' }
  )
);
