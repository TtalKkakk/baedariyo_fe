import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAddressBookStore } from '@/shared/store';

export default function AddressRegisterPage() {
  const navigate = useNavigate();
  const addAddress = useAddressBookStore((state) => state.addAddress);

  const [label, setLabel] = useState('집');
  const [recipientName, setRecipientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [roadAddress, setRoadAddress] = useState('');
  const [jibunAddress, setJibunAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [isDefault, setIsDefault] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();

    addAddress({
      label,
      recipientName,
      phoneNumber,
      roadAddress,
      jibunAddress,
      detailAddress,
      isDefault,
    });

    navigate('/mypage/addresses');
  };

  return (
    <div className="min-h-full bg-white px-4 py-6">
      <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
        주소 등록
      </h1>
      <p className="mt-1 text-body2 text-[var(--color-semantic-label-alternative)]">
        저장한 주소는 주문하기 화면에서 바로 불러올 수 있습니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          type="text"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="주소 별칭 (예: 집, 회사)"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          required
        />

        <input
          type="text"
          value={recipientName}
          onChange={(event) => setRecipientName(event.target.value)}
          placeholder="받는 사람"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          required
        />

        <input
          type="tel"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          placeholder="연락처"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          autoComplete="tel"
          required
        />

        <input
          type="text"
          value={roadAddress}
          onChange={(event) => setRoadAddress(event.target.value)}
          placeholder="도로명 주소"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          required
        />

        <input
          type="text"
          value={jibunAddress}
          onChange={(event) => setJibunAddress(event.target.value)}
          placeholder="지번 주소"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          required
        />

        <input
          type="text"
          value={detailAddress}
          onChange={(event) => setDetailAddress(event.target.value)}
          placeholder="상세 주소"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
          required
        />

        <label className="flex items-center gap-2 text-body3 text-[var(--color-semantic-label-normal)]">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(event) => setIsDefault(event.target.checked)}
          />
          기본 주소로 저장
        </label>

        <button
          type="submit"
          className="w-full h-11 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body1 font-semibold"
        >
          주소 저장
        </button>
      </form>
    </div>
  );
}
