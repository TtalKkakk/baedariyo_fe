import { useNavigate } from 'react-router-dom';

import { useAddressBookStore } from '@/shared/store';

function AddressItem({
  address,
  isDefault,
  onSetDefault,
  onDelete,
  onApplyToCheckout,
}) {
  return (
    <li className="rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          {address?.label ?? '주소'}
        </p>
        {isDefault ? (
          <span className="rounded-full px-2 py-0.5 text-caption1 bg-[var(--color-atomic-redOrange-99)] text-[var(--color-semantic-status-cautionary)]">
            기본 주소
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-body3 text-[var(--color-semantic-label-normal)]">
        {address?.roadAddress}
      </p>
      <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
        {address?.jibunAddress}
      </p>
      <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
        {address?.detailAddress}
      </p>

      <div className="mt-2 text-body3 text-[var(--color-semantic-label-alternative)]">
        <p>받는 사람: {address?.recipientName || '-'}</p>
        <p>연락처: {address?.phoneNumber || '-'}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {!isDefault ? (
          <button
            type="button"
            onClick={() => onSetDefault(address.id)}
            className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body3 font-medium text-[var(--color-semantic-label-normal)]"
          >
            기본으로 설정
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onApplyToCheckout(address.id)}
          className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body3 font-medium text-[var(--color-semantic-label-normal)]"
        >
          주문서에 적용
        </button>
        <button
          type="button"
          onClick={() => onDelete(address.id)}
          className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body3 font-medium text-[var(--color-semantic-status-cautionary)]"
        >
          삭제
        </button>
      </div>
    </li>
  );
}

export default function AddressPage() {
  const navigate = useNavigate();
  const addresses = useAddressBookStore((state) => state.addresses);
  const defaultAddressId = useAddressBookStore(
    (state) => state.defaultAddressId
  );
  const setDefaultAddress = useAddressBookStore(
    (state) => state.setDefaultAddress
  );
  const removeAddress = useAddressBookStore((state) => state.removeAddress);

  const applyAddressToCheckout = (addressId) => {
    navigate('/checkout', { state: { selectedAddressId: addressId } });
  };

  return (
    <div className="min-h-full bg-white px-4 py-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-title2 font-semibold text-[var(--color-semantic-label-normal)]">
          주소 관리
        </h1>
        <button
          type="button"
          onClick={() => navigate('/address/register')}
          className="h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body3 font-medium text-[var(--color-semantic-label-normal)]"
        >
          주소 추가
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="mt-8 rounded-xl border border-[var(--color-semantic-line-normal-normal)] bg-[var(--color-semantic-background-normal-normal)] p-6 text-center">
          <p className="text-body1 font-medium text-[var(--color-semantic-label-normal)]">
            저장된 주소가 없습니다.
          </p>
          <button
            type="button"
            onClick={() => navigate('/address/register')}
            className="mt-3 h-9 px-3 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
          >
            첫 주소 등록하기
          </button>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {addresses.map((address) => (
            <AddressItem
              key={address.id}
              address={address}
              isDefault={address.id === defaultAddressId}
              onSetDefault={setDefaultAddress}
              onDelete={removeAddress}
              onApplyToCheckout={applyAddressToCheckout}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
