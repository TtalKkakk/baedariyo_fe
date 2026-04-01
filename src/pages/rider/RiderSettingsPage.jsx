import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { withdrawRider, updateRiderVehicle } from '@/shared/api';

const VEHICLE_TYPES = [
  { value: 'BICYCLE', label: '자전거', emoji: '🚲' },
  { value: 'MOTORCYCLE', label: '오토바이', emoji: '🛵' },
  { value: 'CAR', label: '자동차', emoji: '🚗' },
  { value: 'E_BICYCLE', label: '전기자전거', emoji: '⚡' },
  { value: 'E_SCOOTER', label: '전동킥보드', emoji: '🛴' },
  { value: 'WALKING', label: '도보', emoji: '🚶' },
  { value: 'ETC', label: '기타', emoji: '📦' },
];

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
  const [region, setRegion] = useState(
    () => localStorage.getItem('riderRegion') ?? ''
  );
  const [vehicleSaved, setVehicleSaved] = useState(false);
  const [regionSaved, setRegionSaved] = useState(() =>
    Boolean(localStorage.getItem('riderRegion'))
  );

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
      localStorage.removeItem('riderRegion');
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
    const isConfirmed = window.confirm(
      '정말 탈퇴하시겠습니까? 배달원 계정 복구는 지원되지 않습니다.'
    );

    if (!isConfirmed) return;

    withdrawMutation.mutate();
  };

  const handleVehicleSave = () => {
    setVehicleSaved(false);
    vehicleMutation.mutate({ vehicleType });
  };

  const handleRegionSave = () => {
    localStorage.setItem('riderRegion', region.trim());
    setRegionSaved(true);
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
              <span className="text-[20px]">{vehicle.emoji}</span>
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

      <div className="mx-4 mt-3 rounded-xl bg-white p-4">
        <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] mb-3">
          활동 지역
        </p>
        <input
          type="text"
          value={region}
          onChange={(event) => {
            setRegion(event.target.value);
            setRegionSaved(false);
          }}
          placeholder="예: 서울 강남구"
          className="w-full h-11 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 outline-none"
        />
        <p className="mt-2 text-body3 text-[var(--color-semantic-label-alternative)]">
          주로 배달하는 지역을 입력하면 해당 지역 콜을 우선으로 받을 수 있어요.
        </p>

        <button
          type="button"
          onClick={handleRegionSave}
          disabled={!region.trim()}
          className="mt-3 w-full h-10 rounded-lg bg-[var(--color-atomic-redOrange-80)] text-white text-body2 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {regionSaved ? '저장됨 ✓' : '저장하기'}
        </button>
      </div>

      <div className="mx-4 mt-3 rounded-xl bg-white p-4 space-y-2">
        <p className="text-body2 font-semibold text-[var(--color-semantic-label-normal)] mb-1">
          계정
        </p>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full h-11 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body2 font-medium text-[var(--color-semantic-label-normal)]"
        >
          로그아웃
        </button>

        <button
          type="button"
          onClick={handleWithdraw}
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
    </div>
  );
}
