import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import { useAddressBookStore } from '@/shared/store';
import { Toast } from '@/shared/ui';

function DeleteConfirmModal({ onCancel, onConfirm }) {
  const frame = document.querySelector('.layout-frame') ?? document.body;

  return createPortal(
    <div className="absolute inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-[328px] bg-white rounded-xl px-4 pt-5 pb-4 flex flex-col">
        <p className="text-h5 font-bold text-center text-[var(--color-semantic-label-normal)]">
          주소를 삭제할까요?
        </p>
        <p className="mt-2 text-body1 font-medium text-center text-[var(--color-semantic-label-neutral)]">
          주소는 삭제하면 되돌릴 수 없습니다.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-11 rounded-[10px] bg-[var(--color-atomic-coolNeutral-96)] text-body1 font-medium text-[var(--color-semantic-label-normal)]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-11 rounded-[10px] bg-[var(--color-atomic-redOrange-80)] text-body1 font-medium text-white"
          >
            삭제
          </button>
        </div>
      </div>
    </div>,
    frame
  );
}

function AddressItem({ address, isDefault, onDeleteRequest, onEdit }) {
  return (
    <li className="py-5 border-b border-[var(--color-semantic-line-normal-normal)] last:border-b-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-body1 font-bold text-[var(--color-semantic-label-normal)]">
              {address?.label ?? '주소'}
            </p>
            {isDefault && (
              <span className="px-[6px] py-[2px] rounded-sm text-caption1 bg-[var(--color-atomic-redOrange-95)] text-[var(--color-atomic-redOrange-80)]">
                현재 설정된 주소
              </span>
            )}
          </div>
          <p className="mt-1 text-body2 text-[var(--color-semantic-label-alternative)]">
            {address?.roadAddress}
            {address?.detailAddress ? ` ${address.detailAddress}` : ''}
          </p>
          {address?.riderMemo && (
            <p className="mt-1 text-body3 text-[var(--color-semantic-label-alternative)]">
              {address.riderMemo}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(address)}
            className="h-8 px-4 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body3 text-[var(--color-semantic-label-normal)]"
          >
            수정
          </button>
          {!isDefault && (
            <button
              type="button"
              onClick={() => onDeleteRequest(address.id)}
              className="h-8 px-4 rounded-md border border-[var(--color-atomic-redOrange-80)] text-body3 text-[var(--color-atomic-redOrange-80)]"
            >
              삭제
            </button>
          )}
        </div>
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
  const removeAddress = useAddressBookStore((state) => state.removeAddress);

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const handleEdit = (address) => {
    navigate('/address/register', {
      state: {
        addressId: address.id,
        label: address.label,
        roadAddress: address.roadAddress,
        jibunAddress: address.jibunAddress,
        detailAddress: address.detailAddress,
        riderMemo: address.riderMemo,
        directions: address.directions,
        latitude: address.latitude,
        longitude: address.longitude,
      },
    });
  };

  const handleConfirmDelete = () => {
    removeAddress(pendingDeleteId);
    setPendingDeleteId(null);
    setShowToast(true);
  };

  return (
    <div className="min-h-full bg-white py-2">
      {addresses.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-body1 text-[var(--color-semantic-label-alternative)]">
            저장된 주소가 없습니다.
          </p>
          <button
            type="button"
            onClick={() => navigate('/address/search')}
            className="mt-3 h-9 px-4 rounded-md border border-[var(--color-semantic-line-normal-normal)] text-body2 text-[var(--color-semantic-label-normal)]"
          >
            주소 추가하기
          </button>
        </div>
      ) : (
        <ul>
          {[...addresses]
            .sort((a, b) =>
              a.id === defaultAddressId ? -1 : b.id === defaultAddressId ? 1 : 0
            )
            .map((address) => (
              <AddressItem
                key={address.id}
                address={address}
                isDefault={address.id === defaultAddressId}
                onDeleteRequest={setPendingDeleteId}
                onEdit={handleEdit}
              />
            ))}
        </ul>
      )}

      {pendingDeleteId && (
        <DeleteConfirmModal
          onCancel={() => setPendingDeleteId(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      <Toast
        message="주소가 삭제되었습니다."
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
