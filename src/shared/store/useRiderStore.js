import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useRiderStore = create(
  devtools(
    persist(
      (set) => ({
        isOnline: false,
        setOnline: () => set({ isOnline: true }),
        setOffline: () => set({ isOnline: false }),
      }),
      { name: 'rider-storage' }
    ),
    { name: 'RiderStore' }
  )
);
