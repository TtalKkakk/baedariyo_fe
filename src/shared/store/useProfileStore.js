import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const defaultProfile = {
  email: '',
  name: '',
  nickname: '',
  phoneNumber: '',
};

export const useProfileStore = create(
  devtools(
    persist(
      (set) => ({
        profile: defaultProfile,

        saveProfile: (payload) =>
          set((state) => ({
            profile: {
              ...state.profile,
              email: payload?.email?.trim() ?? state.profile.email,
              name: payload?.name?.trim() ?? state.profile.name,
              nickname: payload?.nickname?.trim() ?? state.profile.nickname,
              phoneNumber:
                payload?.phoneNumber?.trim() ?? state.profile.phoneNumber,
            },
          })),

        resetProfile: () => set({ profile: defaultProfile }),
      }),
      { name: 'profile-storage' }
    ),
    { name: 'ProfileStore' }
  )
);
