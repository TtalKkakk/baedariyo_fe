import { useQuery } from '@tanstack/react-query';

// import { getUserProfile } from '@/shared/api';
import { useProfileStore } from '@/shared/store';
import { BottomModal } from '@/shared/ui';

function InfoRow({ icon, label, value, action }) {
  return (
    <div className="flex items-center py-3.5">
      <span className="mr-3 text-[var(--color-semantic-label-alternative)]">
        {icon}
      </span>
      <span className="text-body2 font-medium text-[var(--color-semantic-label-normal)]">
        {label}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-body2 text-[var(--color-semantic-label-alternative)]">
          {value}
        </span>
        {action ?? null}
      </div>
    </div>
  );
}

function NameIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <text
        x="4"
        y="17"
        fontSize="14"
        fontWeight="500"
        fill="currentColor"
        fontFamily="sans-serif"
      >
        Aa
      </text>
    </svg>
  );
}

function NicknameIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BirthIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="8"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 3v3M8 8V6M16 8V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 7l9 6 9-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProfilePage() {
  const localProfile = useProfileStore((state) => state.profile);
  const saveProfile = useProfileStore((state) => state.saveProfile);

  const { data: serverProfile } = useQuery({
    queryKey: ['user-profile'],
    // queryFn: getUserProfile,
    enabled: false, // TODO: 백엔드 연결 시 enabled: !!localStorage.getItem('accessToken') 로 교체
  });

  const profile = serverProfile ?? localProfile;

  const handleChangeNickname = () => {
    const nextNickname = window.prompt(
      '새 닉네임을 입력해주세요.',
      profile.nickname || ''
    );

    if (nextNickname === null) return;

    const trimmed = nextNickname.trim();
    if (!trimmed) return;

    saveProfile({ nickname: trimmed });
  };

  return (
    <div className="min-h-full bg-white pb-8">
      <p className="py-3 text-caption1 font-semibold text-[var(--color-semantic-label-alternative)]">
        기본 정보
      </p>

      <InfoRow icon={<NameIcon />} label="이름" value={profile.name || '-'} />

      <InfoRow
        icon={<NicknameIcon />}
        label="닉네임"
        value={profile.nickname || '-'}
        action={
          <button
            type="button"
            onClick={handleChangeNickname}
            className="rounded-md border border-[var(--color-semantic-line-normal-normal)] px-2.5 py-1 text-caption1 text-[var(--color-semantic-label-normal)]"
          >
            변경
          </button>
        }
      />

      <InfoRow
        icon={<EmailIcon />}
        label="이메일"
        value={profile.email || '-'}
      />

      <InfoRow
        icon={<PhoneIcon />}
        label="전화번호"
        value={profile.phoneNumber || '-'}
      />

      <button
        type="button"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-semantic-line-normal-normal)] py-3 text-body2 text-[var(--color-semantic-label-alternative)]"
      >
        <NicknameIcon />
        본인인증으로 변경
      </button>
    </div>
  );
}
