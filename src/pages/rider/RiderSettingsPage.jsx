import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

import { withdrawRider, updateRiderVehicle } from '@/shared/api';
import BicycleIcon from '@/shared/assets/icons/order-status/bicycle.svg?react';
import MopedIcon from '@/shared/assets/icons/order-status/moped.svg?react';
import CarIcon from '@/shared/assets/icons/order-status/car.svg?react';
import MopeddIcon from '@/shared/assets/icons/order-status/mopedd.svg?react';
import ScooterIcon from '@/shared/assets/icons/order-status/scooter.svg?react';
import WalkIcon from '@/shared/assets/icons/order-status/walk.svg?react';
import UserIcon from '@/shared/assets/icons/nav/mypage.svg?react';

const VEHICLE_TYPES = [
  { value: 'BICYCLE', label: '자전거', icon: BicycleIcon },
  { value: 'MOTORCYCLE', label: '오토바이', icon: MopedIcon },
  { value: 'CAR', label: '자동차', icon: CarIcon },
  { value: 'E_BICYCLE', label: '전기자전거', icon: MopeddIcon },
  { value: 'E_SCOOTER', label: '전동킥보드', icon: ScooterIcon },
  { value: 'WALKING', label: '도보', icon: WalkIcon },
  { value: 'ETC', label: '기타', emoji: '📦' },
];

function ConfirmModal({
  title,
  description,
  confirmLabel,
  confirmClassName,
  onConfirm,
  onCancel,
}) {
  const portalTarget = document.querySelector('.layout-frame') || document.body;
  return createPortal(
    <div className="absolute inset-0 z-50 flex items-end bg-black/40">
      <div className="w-full bg-white rounded-t-2xl px-5 pt-6 pb-8">
        <p className="text-[18px] font-bold text-center text-[var(--color-semantic-label-normal)]">
          {title}
        </p>
        <p className="mt-2 text-body2 text-center text-[var(--color-semantic-label-alternative)] leading-relaxed">
          {description}
        </p>
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-12 rounded-xl border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 h-12 rounded-xl text-body2 font-semibold text-white ${confirmClassName}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    portalTarget
  );
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ?? error?.message ?? '요청에 실패했습니다.'
  );
}

export default function RiderSettingsPage() {
  const navigate = useNavigate();

  const [vehicleType, setVehicleType] = useState(
    () => localStorage.getItem('riderVehicleType') ?? 'MOTORCYCLE'
  );
  const [vehicleSaved, setVehicleSaved] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const vehicleMutation = useMutation({
    mutationFn: updateRiderVehicle,
    onSuccess: () => {
      localStorage.setItem('riderVehicleType', vehicleType);
      setVehicleSaved(true);
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: withdrawRider,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('riderVehicleType');
      navigate('/rider/login');
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/rider/login');
  };

  const handleWithdraw = () => {
    withdrawMutation.mutate();
  };

  const handleVehicleSave = () => {
    setVehicleSaved(false);
    vehicleMutation.mutate({ vehicleType });
  };

  return (
    <div className="bg-[var(--color-atomic-coolNeutral-97)] min-h-full pb-6">
      <div className="bg-white px-4 py-4">
        <p className="text-body1 font-semibold text-[var(--color-semantic-label-normal)]">
          설정
        </p>
      </div>

      <div className="mx-4 mt-4 rounded-xl bg-white p-4">
        <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] mb-3">
          배달 수단
        </p>

        <div className="grid grid-cols-3 gap-2">
          {VEHICLE_TYPES.map((vehicle) => (
            <button
              key={vehicle.value}
              type="button"
              onClick={() => {
                setVehicleType(vehicle.value);
                setVehicleSaved(false);
              }}
              className={`h-[68px] rounded-lg border flex flex-col items-center justify-center gap-1 ${
                vehicleType === vehicle.value
                  ? 'border-[var(--color-atomic-redOrange-80)] bg-[var(--color-atomic-redOrange-80)]/5'
                  : 'border-[var(--color-semantic-line-normal-normal)]'
              }`}
            >
              {vehicle.icon ? (
                <vehicle.icon
                  className={`size-5 ${
                    vehicleType === vehicle.value
                      ? '[&_path]:fill-[var(--color-atomic-redOrange-80)]'
                      : '[&_path]:fill-[var(--color-semantic-label-alternative)]'
                  }`}
                />
              ) : (
                <span className="text-[20px]">{vehicle.emoji}</span>
              )}
              <span
                className={`text-body3 font-medium ${
                  vehicleType === vehicle.value
                    ? 'text-[var(--color-atomic-redOrange-80)]'
                    : 'text-[var(--color-semantic-label-alternative)]'
                }`}
              >
                {vehicle.label}
              </span>
            </button>
          ))}
        </div>

        {vehicleMutation.isError && (
          <p className="mt-2 text-body3 text-[var(--color-semantic-status-cautionary)]">
            {getErrorMessage(vehicleMutation.error)}
          </p>
        )}

        <button
          type="button"
          onClick={handleVehicleSave}
          disabled={vehicleMutation.isPending}
          className="mt-3 w-full h-10 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body2 font-semibold disabled:opacity-40"
        >
          {vehicleSaved
            ? '저장됨 ✓'
            : vehicleMutation.isPending
              ? '저장 중...'
              : '저장하기'}
        </button>
      </div>

      <div className="mx-4 mt-3 rounded-xl bg-white p-4 space-y-2">
        <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] mb-1">
          계정
        </p>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full h-11 rounded-lg bg-[var(--color-atomic-coolNeutral-97)] flex items-center justify-center gap-2"
        >
          <UserIcon className="size-5 [&_path]:fill-[var(--color-semantic-label-normal)]" />
          <span className="text-body2 font-semibold text-[var(--color-semantic-label-normal)]">
            주문자로 전환
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className="w-full h-11 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
        >
          로그아웃
        </button>

        <button
          type="button"
          onClick={() => setShowWithdrawModal(true)}
          disabled={withdrawMutation.isPending}
          className="w-full h-11 rounded-lg bg-[var(--color-semantic-status-cautionary)] text-white text-body2 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {withdrawMutation.isPending ? '탈퇴 처리 중...' : '배달원 탈퇴'}
        </button>

        {withdrawMutation.isError && (
          <p className="text-body3 text-[var(--color-semantic-status-cautionary)]">
            {getErrorMessage(withdrawMutation.error)}
          </p>
        )}
      </div>

      {showLogoutModal && (
        <ConfirmModal
          title="로그아웃"
          description="정말 로그아웃 하시겠어요?"
          confirmLabel="로그아웃"
          confirmClassName="bg-[var(--color-semantic-label-normal)]"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      {showWithdrawModal && (
        <ConfirmModal
          title="배달원 탈퇴"
          description={`탈퇴하면 계정을 복구할 수 없어요.\n정말 탈퇴하시겠어요?`}
          confirmLabel={withdrawMutation.isPending ? '처리 중...' : '탈퇴하기'}
          confirmClassName="bg-[var(--color-semantic-status-cautionary)]"
          onConfirm={handleWithdraw}
          onCancel={() => setShowWithdrawModal(false)}
        />
      )}
    </div>
  );
}
