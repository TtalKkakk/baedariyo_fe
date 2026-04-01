import { create } from 'zustand';

export const DELIVERY_STATUSES = ['CONFIRMED', 'PREPARING', 'DELIVERING', 'DELIVERED'];

export const DELIVERY_STATUS_LABELS = {
  CONFIRMED: '주문 접수',
  PREPARING: '메뉴 준비중',
  DELIVERING: '배달 중',
  DELIVERED: '배달 완료',
};

// Demo-friendly durations (ms)
const STEP_DURATIONS = [15000, 35000, 50000]; // CONFIRMED→PREPARING, PREPARING→DELIVERING, DELIVERING→DELIVERED

export const useActiveOrderStore = create((set, get) => ({
  activeOrders: [],

  addActiveOrder: (orderInfo) => {
    const { paymentId } = orderInfo;

    if (get().activeOrders.find((o) => o.paymentId === paymentId)) return;

    const order = {
      ...orderInfo,
      deliveryStatus: 'CONFIRMED',
    };

    set((state) => ({ activeOrders: [order, ...state.activeOrders] }));
    get()._scheduleNext(paymentId, 0);
  },

  _scheduleNext: (paymentId, stepIndex) => {
    if (stepIndex >= STEP_DURATIONS.length) return;

    setTimeout(() => {
      const nextStatus = DELIVERY_STATUSES[stepIndex + 1];

      set((state) => ({
        activeOrders: state.activeOrders.map((o) =>
          o.paymentId === paymentId ? { ...o, deliveryStatus: nextStatus } : o
        ),
      }));

      if (nextStatus === 'DELIVERED') {
        setTimeout(() => {
          set((state) => ({
            activeOrders: state.activeOrders.filter((o) => o.paymentId !== paymentId),
          }));
        }, 8000);
      } else {
        get()._scheduleNext(paymentId, stepIndex + 1);
      }
    }, STEP_DURATIONS[stepIndex]);
  },
}));
