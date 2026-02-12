import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Zustand Store 예시
 * 실제 사용 시 이 파일을 참고하여 새로운 store 생성
 */
export const useExampleStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        count: 0,
        user: null,

        // Actions
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
        reset: () => set({ count: 0 }),

        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),

        // Getter (computed)
        getDoubleCount: () => get().count * 2,
      }),
      {
        name: 'example-storage', // localStorage key
        partialize: (state) => ({ count: state.count }), // 일부만 persist
      }
    ),
    { name: 'ExampleStore' } // devtools name
  )
);
