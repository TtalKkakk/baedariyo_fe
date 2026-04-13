import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

function createAddressId() {
  return `addr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// 데모용 기본 주소 seed — 주소가 비어있으면 자동 복원된다.
const DEMO_SEED_ADDRESSES = [
  {
    id: 'addr-seed-home',
    label: '집',
    alias: '집',
    recipientName: '홍길동',
    phoneNumber: '010-6659-5866',
    roadAddress: '서울특별시 구로구 구로중앙로 152',
    jibunAddress: '서울특별시 구로구 구로동 440-1',
    detailAddress: '101동 1502호',
    riderMemo: '공동현관 비밀번호는 #1234 입니다.',
    directions: '',
    latitude: 37.4956,
    longitude: 126.8874,
    createdAt: '2026-03-01T09:00:00.000Z',
  },
  {
    id: 'addr-seed-office',
    label: '회사',
    alias: '회사',
    recipientName: '홍길동',
    phoneNumber: '010-6659-5866',
    roadAddress: '서울특별시 영등포구 여의대로 128',
    jibunAddress: '서울특별시 영등포구 여의도동 20',
    detailAddress: 'LG트윈타워 서관 15층',
    riderMemo: '로비에 두고 문자 부탁드려요.',
    directions: '',
    latitude: 37.5264,
    longitude: 126.9256,
    createdAt: '2026-03-05T09:00:00.000Z',
  },
  {
    id: 'addr-seed-parent',
    label: '본가',
    alias: '본가',
    recipientName: '홍길동',
    phoneNumber: '010-6659-5866',
    roadAddress: '경기도 성남시 분당구 판교역로 235',
    jibunAddress: '경기도 성남시 분당구 삼평동 680',
    detailAddress: '에이치스퀘어 N동 12층',
    riderMemo: '',
    directions: '',
    latitude: 37.4021,
    longitude: 127.1086,
    createdAt: '2026-03-10T09:00:00.000Z',
  },
];

export const useAddressBookStore = create(
  devtools(
    persist(
      (set) => ({
        addresses: DEMO_SEED_ADDRESSES,
        defaultAddressId: DEMO_SEED_ADDRESSES[0].id,

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
      {
        name: 'address-book-storage',
        // 데모: 복원된 상태에 주소가 없으면 seed 자동 주입
        onRehydrateStorage: () => (state) => {
          if (state && (!state.addresses || state.addresses.length === 0)) {
            state.addresses = DEMO_SEED_ADDRESSES;
            state.defaultAddressId = DEMO_SEED_ADDRESSES[0].id;
          }
        },
      }
    ),
    { name: 'AddressBookStore' }
  )
);
