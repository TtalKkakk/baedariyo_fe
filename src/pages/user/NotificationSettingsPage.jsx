import { useNotificationStore } from '@/shared/store';

function SettingRow({ title, description, checked, onChange }) {
  return (
    <label className="flex items-start justify-between gap-3 py-3">
      <div>
        <p className="text-body2 font-medium text-[var(--color-semantic-label-normal)]">
          {title}
        </p>
        <p className="mt-1 text-caption1 text-[var(--color-semantic-label-alternative)]">
          {description}
        </p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

export default function NotificationSettingsPage() {
  const settings = useNotificationStore((state) => state.settings);
  const updateSetting = useNotificationStore((state) => state.updateSetting);

  return (
    <div className="min-h-full bg-white px-4 py-4 pb-8">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        알림 설정
      </h1>
      <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
        설정값은 브라우저에 저장되며, 이후 알림 생성 시 반영됩니다.
      </p>

      <section className="mt-4 rounded-xl border border-[var(--color-semantic-line-normal-normal)] divide-y divide-[var(--color-semantic-line-normal-normal)] px-3">
        <SettingRow
          title="주문 상태 알림"
          description="주문 생성/처리 관련 알림을 받습니다."
          checked={settings.orderUpdates}
          onChange={(nextValue) => updateSetting('orderUpdates', nextValue)}
        />
        <SettingRow
          title="리뷰 리마인드 알림"
          description="리뷰 작성/수정 관련 알림을 받습니다."
          checked={settings.reviewReminders}
          onChange={(nextValue) => updateSetting('reviewReminders', nextValue)}
        />
        <SettingRow
          title="마케팅 알림"
          description="쿠폰/이벤트 등 마케팅 소식을 받습니다."
          checked={settings.marketing}
          onChange={(nextValue) => updateSetting('marketing', nextValue)}
        />
      </section>
    </div>
  );
}
