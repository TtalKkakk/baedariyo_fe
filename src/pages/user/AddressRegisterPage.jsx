import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { loadKakaoMapSdk } from '@/shared/lib/loadKakaoMap';
import { useAddressBookStore } from '@/shared/store';
import ArrowIcon from '@/shared/assets/icons/header/arrow.svg?react';
import BackIcon from '@/shared/assets/icons/header/back.svg?react';
import CheckIcon from '@/shared/assets/icons/header/check.svg?react';
import XCircleIcon from '@/shared/assets/icons/header/x-circle.svg?react';

const RIDER_MEMO_OPTIONS = [
  '문 앞에 두고 벨을 눌러주세요',
  '문 앞에 두고 노크해주세요',
  '문 앞에 두면 가져갈게요',
  '직접 받을게요',
  '전화 주시면 마중 나갈게요',
];

export default function AddressRegisterPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const addAddress = useAddressBookStore((s) => s.addAddress);
  const updateAddress = useAddressBookStore((s) => s.updateAddress);
  const mapElRef = useRef(null);
  const expandedMapElRef = useRef(null);

  const addressId = state?.addressId ?? null;
  const isEditing = !!addressId;

  const roadAddress = state?.roadAddress ?? '';
  const jibunAddress = state?.jibunAddress ?? '';
  const latitude = state?.latitude ?? 37.5665;
  const longitude = state?.longitude ?? 126.978;

  const LABEL_PRESETS = ['집', '회사', '기타'];
  const initialLabel = state?.label ?? '집';
  const initialPreset = LABEL_PRESETS.includes(initialLabel)
    ? initialLabel
    : '기타';
  const [labelPreset, setLabelPreset] = useState(initialPreset);
  const [customLabel, setCustomLabel] = useState(
    initialPreset === '기타' ? initialLabel : ''
  );

  const [detailAddress, setDetailAddress] = useState(
    state?.detailAddress ?? ''
  );
  const [showDetailError, setShowDetailError] = useState(false);
  const [riderMemo, setRiderMemo] = useState(
    state?.riderMemo ?? RIDER_MEMO_OPTIONS[0]
  );
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [directions, setDirections] = useState(state?.directions ?? '');
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    loadKakaoMapSdk()
      .then((kakao) => {
        if (!isMounted || !mapElRef.current) return;
        const center = new kakao.maps.LatLng(latitude, longitude);
        const map = new kakao.maps.Map(mapElRef.current, { center, level: 3 });
        new kakao.maps.Marker({ position: center }).setMap(map);
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  useEffect(() => {
    if (!isMapExpanded) return;
    let isMounted = true;

    loadKakaoMapSdk()
      .then((kakao) => {
        if (!isMounted || !expandedMapElRef.current) return;
        const center = new kakao.maps.LatLng(latitude, longitude);
        const map = new kakao.maps.Map(expandedMapElRef.current, {
          center,
          level: 3,
        });
        new kakao.maps.Marker({ position: center }).setMap(map);
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, [isMapExpanded, latitude, longitude]);

  const resolvedLabel =
    labelPreset === '기타' ? customLabel.trim() || '기타' : labelPreset;

  const handleSubmit = () => {
    if (!detailAddress) {
      setShowDetailError(true);
      return;
    }
    if (isEditing) {
      updateAddress(addressId, {
        label: resolvedLabel,
        detailAddress,
        riderMemo,
        directions,
      });
      navigate('/mypage/addresses');
    } else {
      addAddress({
        label: resolvedLabel,
        recipientName: '',
        phoneNumber: '',
        roadAddress,
        jibunAddress,
        detailAddress,
        riderMemo,
        directions,
        latitude,
        longitude,
        isDefault: true,
      });
      navigate('/address/setting');
    }
  };

  return (
    <div className="relative flex flex-col h-screen bg-white">
      {/* 헤더 */}
      <header className="relative flex items-center h-12 px-4 bg-white shrink-0">
        <button type="button" onClick={() => navigate(-1)} className="shrink-0">
          <BackIcon className="size-5" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 text-h6 font-medium text-[var(--color-semantic-label-normal)]">
          {isEditing ? '주소 편집' : '주소 상세'}
        </span>
      </header>

      {/* 지도 */}
      <div className="relative h-[160px] shrink-0 px-4 pt-2">
        <div ref={mapElRef} className="w-full h-full" />
        <button
          type="button"
          onClick={() => setIsMapExpanded(true)}
          className="absolute bottom-3 right-7 z-10 h-7 px-3 bg-[#3A3A3A] text-white text-caption2 font-medium rounded-full"
        >
          지도에서 위치 확인
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-auto px-4 pt-4 pb-4">
        {/* 주소 표시 */}
        <div className="mb-4">
          <p className="text-h5 font-bold text-[var(--color-semantic-label-normal)]">
            {roadAddress || '주소 정보 없음'}
          </p>
          {jibunAddress ? (
            <p className="mt-[6px] text-body1 font-medium text-[var(--color-semantic-label-normal)]">
              {jibunAddress}
            </p>
          ) : null}
        </div>

        {/* 주소 이름 */}
        <div className="mb-4">
          <p className="text-body2 font-medium text-[var(--color-semantic-label-normal)] mb-[6px]">
            주소 이름
          </p>
          <div className="flex gap-2">
            {LABEL_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setLabelPreset(preset)}
                className={`flex-1 h-9 rounded-lg border text-body2 font-medium ${
                  labelPreset === preset
                    ? 'bg-[var(--color-atomic-redOrange-80)] text-white border-[var(--color-atomic-redOrange-80)]'
                    : 'bg-white text-[var(--color-semantic-label-normal)] border-[var(--color-semantic-line-normal-normal)]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          {labelPreset === '기타' && (
            <input
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="주소 이름 입력"
              className="mt-2 w-full h-10 py-2 px-3 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body1 text-[var(--color-semantic-label-normal)] placeholder:text-[var(--color-semantic-label-alternative)] outline-none"
            />
          )}
        </div>

        {/* 상세주소 입력 */}
        <div className="relative">
          <input
            type="text"
            value={detailAddress}
            onChange={(e) => {
              setDetailAddress(e.target.value);
              setShowDetailError(false);
            }}
            placeholder="건물명, 동/호수 등의 상세주소 입력"
            className="w-full h-10 py-2 px-3 pr-9 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body1 text-[var(--color-semantic-label-normal)] placeholder:text-[var(--color-semantic-label-alternative)] outline-none"
          />
          {detailAddress && (
            <button
              type="button"
              onClick={() => setDetailAddress('')}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <XCircleIcon className="size-4" />
            </button>
          )}
        </div>
        {showDetailError && (
          <p className="mt-1.5 text-body2 text-[var(--color-semantic-status-negative)]">
            상세주소를 입력하면 더 정확하게 배달이 가능합니다
          </p>
        )}

        {/* 라이더에게 메모 */}
        <div className="mt-4">
          <p className="text-body2 font-medium text-[var(--color-semantic-label-normal)] mb-[6px]">
            라이더에게 메모
          </p>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMemoOpen((v) => !v)}
              className="w-full h-10 py-2 px-3 pr-10 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body1 text-[var(--color-semantic-label-normal)] bg-white text-left"
            >
              {riderMemo}
            </button>
            <ArrowIcon
              className={`absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none transition-transform [&_path]:fill-[var(--color-semantic-label-normal)] ${isMemoOpen ? 'rotate-180' : ''}`}
            />
            {isMemoOpen && (
              <ul className="absolute top-[calc(100%+4px)] left-0 right-0 z-20 py-3.5 bg-white rounded-lg border border-[var(--color-semantic-line-normal-normal)] shadow-[var(--style-semantic-shadow-emphasize)]">
                {RIDER_MEMO_OPTIONS.map((opt) => (
                  <li key={opt}>
                    <button
                      type="button"
                      onClick={() => {
                        setRiderMemo(opt);
                        setIsMemoOpen(false);
                      }}
                      className="w-full h-8 flex items-center gap-3 px-5 text-left"
                    >
                      <span className="shrink-0 w-4 h-4 rounded-full border-2 border-[var(--color-semantic-line-normal-normal)] flex items-center justify-center">
                        {riderMemo === opt && (
                          <CheckIcon className="size-3 [&_path]:fill-[var(--color-semantic-label-normal)]" />
                        )}
                      </span>
                      <span className="text-body2 font-normal text-[var(--color-semantic-label-normal)]">
                        {opt}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 길 안내 */}
        <div className="mt-4">
          <p className="text-body2 font-medium text-[var(--color-semantic-label-normal)] mb-[6px]">
            길 안내
          </p>
          <div className="relative">
            <input
              type="text"
              value={directions}
              onChange={(e) => setDirections(e.target.value)}
              placeholder="예) 1층에 미용실에서 우측으로 있는 아파트입니다"
              className="w-full h-10 py-2 px-3 pr-9 rounded-lg border border-[var(--color-semantic-line-normal-normal)] text-body1 text-[var(--color-semantic-label-normal)] placeholder:text-[var(--color-semantic-label-alternative)] outline-none"
            />
            {directions && (
              <button
                type="button"
                onClick={() => setDirections('')}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <XCircleIcon className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="px-4 pb-8 pt-2 shrink-0">
        <button
          type="button"
          onClick={handleSubmit}
          className={`w-full h-12 rounded-lg text-h6 font-medium transition-colors ${
            detailAddress
              ? 'bg-[var(--color-atomic-redOrange-80)] text-[var(--color-semantic-static-white)]'
              : 'bg-[var(--color-semantic-interaction-disable)] text-[var(--color-semantic-label-disable)]'
          }`}
        >
          {isEditing ? '수정 완료' : '주소 등록'}
        </button>
      </div>

      {/* 지도 확장 오버레이 */}
      {isMapExpanded && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white">
          <header className="relative flex items-center h-12 px-4 bg-white shrink-0">
            <button
              type="button"
              onClick={() => setIsMapExpanded(false)}
              className="shrink-0"
            >
              <BackIcon className="size-5" />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 text-h6 font-medium text-[var(--color-semantic-label-normal)]">
              위치 확인
            </span>
          </header>
          <div className="flex-1 px-4 py-4">
            <div ref={expandedMapElRef} className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
}
