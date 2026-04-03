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
          riderMemo,
          directions,
          latitude,
          longitude,
          isDefault = false,
        }) =>
          set((state) => {
            const nextAddress = {
              id: createAddressId(),
              label: label?.trim() || '기본 주소',
              alias: label?.trim() || '기본 주소',
              recipientName: recipientName?.trim() || '',
              phoneNumber: phoneNumber?.trim() || '',
              roadAddress: roadAddress?.trim() || '',
              jibunAddress: jibunAddress?.trim() || '',
              detailAddress: detailAddress?.trim() || '',
              riderMemo: riderMemo ?? '',
              directions: directions ?? '',
              latitude: latitude ?? null,
              longitude: longitude ?? null,
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
            const target = state.addresses.find(
              (item) => item.id === addressId
            );

            if (!target) return state;

            console.log('기본주소 alias:', target.alias);

            return { defaultAddressId: addressId };
          }),

        removeAddress: (addressId) =>
          set((state) => {
            const target = state.addresses.find(
              (item) => item.id === addressId
            );

            const nextAddresses = state.addresses.filter(
              (item) => item.id !== addressId
            );

            const nextDefaultAddressId =
              state.defaultAddressId === addressId
                ? (nextAddresses[0]?.id ?? null)
                : state.defaultAddressId;

            console.log('삭제할 alias:', target?.alias);

            return {
              addresses: nextAddresses,
              defaultAddressId: nextDefaultAddressId,
            };
          }),

        updateAddress: (addressId, fields) =>
          set((state) => {
            const prev = state.addresses.find((item) => item.id === addressId);

            const nextAddresses = state.addresses.map((item) =>
              item.id === addressId
                ? {
                    ...item,
                    ...fields,
                    alias: fields.label ? fields.label.trim() : item.alias,
                  }
                : item
            );

            if (fields.label && prev?.label !== fields.label) {
              console.log('alias 변경:', prev.label, '→', fields.label);
            }

            return {
              addresses: nextAddresses,
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
