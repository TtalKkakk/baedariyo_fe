import { useState } from 'react';

import { useProfileStore } from '@/shared/store';

export default function ProfilePage() {
  const profile = useProfileStore((state) => state.profile);
  const saveProfile = useProfileStore((state) => state.saveProfile);

  const [email, setEmail] = useState(profile.email);
  const [name, setName] = useState(profile.name);
  const [nickname, setNickname] = useState(profile.nickname);
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    saveProfile({
      email,
      name,
      nickname,
      phoneNumber,
    });
    setIsSaved(true);
  };

  return (
    <div className="min-h-full bg-white px-4 py-6">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        프로필 수정
      </h1>
      <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
        프로필 정보는 브라우저 로컬 저장소에 저장됩니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="이메일"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
        />
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="이름"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
        />
        <input
          type="text"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="닉네임"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
        />
        <input
          type="tel"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          placeholder="연락처"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          autoComplete="tel"
        />
        <button
          type="submit"
          className="w-full h-11 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body1 font-semibold"
        >
          프로필 저장
        </button>
      </form>

      {isSaved ? (
        <p className="mt-3 text-body3 text-[var(--color-semantic-label-normal)]">
          프로필이 저장되었습니다.
        </p>
      ) : null}
    </div>
  );
}
