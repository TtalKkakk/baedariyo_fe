import { useMemo, useState } from 'react';

import { useNotificationStore } from '@/shared/store';
import { ConfirmModal, Toast } from '@/shared/ui';

function formatDateTime(value) {
  if (!value) return '-';

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return parsedDate.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function NotificationItem({ item, onRead }) {
  return (
    <li
      className={`rounded-xl border p-4 ${
        item.isRead
          ? 'border-[var(--color-semantic-line-normal-normal)] bg-white'
          : 'border-[var(--color-atomic-redOrange-95)] bg-[var(--color-atomic-redOrange-99)]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
          {item.title}
        </p>
        {!item.isRead ? (
          <span className="rounded-full px-2 py-0.5 text-caption1 bg-[var(--color-atomic-redOrange-80)] text-white">
            NEW
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-body3 text-[var(--color-semantic-label-normal)]">
        {item.description || '-'}
      </p>
      <p className="mt-2 text-caption1 text-[var(--color-semantic-label-alternative)]">
        {formatDateTime(item.createdAt)}
      </p>
      {!item.isRead ? (
        <button
          type="button"
          onClick={() => onRead(item.id)}
          className="mt-2 h-8 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-caption1"
        >
          읽음 처리
        </button>
      ) : null}
    </li>
  );
}

export default function NotificationsPage() {
  const notifications = useNotificationStore((state) => state.notifications);
  const markNotificationAsRead = useNotificationStore(
    (state) => state.markNotificationAsRead
  );
  const markAllNotificationsAsRead = useNotificationStore(
    (state) => state.markAllNotificationsAsRead
  );
  const clearNotifications = useNotificationStore(
    (state) => state.clearNotifications
  );
  const [showClearModal, setShowClearModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  return (
    <div className="min-h-full bg-white py-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
          알림
        </h1>
        <p className="text-caption1 text-[var(--color-semantic-label-alternative)]">
          {notifications.length}개 / 미읽음 {unreadCount}개
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={markAllNotificationsAsRead}
          disabled={notifications.length === 0}
          className="h-8 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-caption1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          모두 읽음
        </button>
        <button
          type="button"
          onClick={() => setShowClearModal(true)}
          disabled={notifications.length === 0}
          className="h-8 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-caption1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          전체 삭제
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] p-6 text-center">
          <p className="text-body1 font-medium text-[var(--color-semantic-label-normal)]">
            도착한 알림이 없습니다.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {notifications.map((item) => (
            <NotificationItem
              key={item.id}
              item={item}
              onRead={markNotificationAsRead}
            />
          ))}
        </ul>
      )}

      <ConfirmModal
        isOpen={showClearModal}
        title="알림을 전체 삭제할까요?"
        description="삭제한 알림은 복구할 수 없습니다."
        confirmLabel="전체 삭제"
        cancelLabel="취소"
        onConfirm={() => {
          clearNotifications();
          setShowClearModal(false);
          setShowToast(true);
        }}
        onCancel={() => setShowClearModal(false)}
      />

      <Toast
        message="알림이 전체 삭제되었습니다."
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
