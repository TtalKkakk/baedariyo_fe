import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

function createNotificationId() {
  return `noti-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toNotificationItem(payload) {
  return {
    id: createNotificationId(),
    title: payload?.title ?? '알림',
    description: payload?.description ?? '',
    type: payload?.type ?? 'GENERAL',
    isRead: false,
    createdAt: new Date().toISOString(),
  };
}

const initialSettings = {
  orderUpdates: true,
  reviewReminders: true,
  marketing: false,
};

const initialNotifications = [
  {
    id: 'welcome-notification',
    title: '알림함 준비 완료',
    description: '주문/리뷰 흐름에서 발생한 알림을 여기서 확인할 수 있습니다.',
    type: 'GENERAL',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

export const useNotificationStore = create(
  devtools(
    persist(
      (set) => ({
        settings: initialSettings,
        notifications: initialNotifications,

        updateSetting: (key, value) =>
          set((state) => ({
            settings: {
              ...state.settings,
              [key]: Boolean(value),
            },
          })),

        pushNotification: (payload) =>
          set((state) => {
            const type = payload?.type ?? 'GENERAL';

            if (type === 'ORDER' && !state.settings.orderUpdates) return state;
            if (type === 'REVIEW' && !state.settings.reviewReminders)
              return state;
            if (type === 'MARKETING' && !state.settings.marketing) return state;

            return {
              notifications: [
                toNotificationItem(payload),
                ...state.notifications,
              ].slice(0, 100),
            };
          }),

        markNotificationAsRead: (notificationId) =>
          set((state) => ({
            notifications: state.notifications.map((item) =>
              item.id === notificationId ? { ...item, isRead: true } : item
            ),
          })),

        markAllNotificationsAsRead: () =>
          set((state) => ({
            notifications: state.notifications.map((item) => ({
              ...item,
              isRead: true,
            })),
          })),

        clearNotifications: () => set({ notifications: [] }),
      }),
      { name: 'notification-storage' }
    ),
    { name: 'NotificationStore' }
  )
);
