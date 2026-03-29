import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createOrder, getStoreMenus } from '@/shared/api';
import {
  useAddressBookStore,
  useCartStore,
  useNotificationStore,
  useProfileStore,
} from '@/shared/store';
import { BottomModal, BottomSheet } from '@/shared/ui';
import ArrowIcon from '@/shared/assets/icons/header/arrow.svg?react';
import CheckIcon from '@/shared/assets/icons/header/check.svg?react';
import HomeIcon from '@/shared/assets/icons/checkout/home.svg?react';

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function toMenuName(menu) {
  if (typeof menu?.menuName === 'string') return menu.menuName;
  if (typeof menu?.menuName?.value === 'string') return menu.menuName.value;
  if (typeof menu?.name === 'string') return menu.name;
  return '';
}

function toPriceAmount(price) {
  if (typeof price === 'number') return price;
  if (typeof price?.amount === 'number') return price.amount;
  return null;
}

function formatAmount(amount) {
  if (typeof amount !== 'number') return '-';
  return `${amount.toLocaleString('ko-KR')}원`;
}

function getItemUnitAmount(item) {
  const base =
    typeof item?.basePriceAmount === 'number' ? item.basePriceAmount : 0;
  const optionSum = (
    Array.isArray(item?.selectedOptions) ? item.selectedOptions : []
  ).reduce((acc, option) => acc + (option?.optionPriceAmount ?? 0), 0);
  return base + optionSum;
}

function getStoreIdFromMenus(menus) {
  if (!Array.isArray(menus)) return null;
  for (const menu of menus) {
    const rawStoreId = menu?.storeId ?? menu?.store?.id;
    const parsedStoreId = Number(rawStoreId);
    if (isPositiveInteger(parsedStoreId)) return parsedStoreId;
  }
  return null;
}

function getMenuIdFromMenus(menus, item) {
  if (!Array.isArray(menus) || menus.length === 0) return null;
  const normalizedMenuName = item?.menuName ?? '';
  const baseAmount =
    typeof item?.basePriceAmount === 'number' ? item.basePriceAmount : null;
  const unitAmount = getItemUnitAmount(item);
  const byName = menus.filter(
    (menu) => toMenuName(menu) === normalizedMenuName
  );
  const byNameAndPrice = byName.find((menu) => {
    const amount = toPriceAmount(menu?.price);
    return amount === baseAmount || amount === unitAmount;
  });
  const target = byNameAndPrice ?? byName[0] ?? menus[0];
  const parsedMenuId = Number(target?.id ?? target?.menuId);
  return isPositiveInteger(parsedMenuId) ? parsedMenuId : null;
}

function getOrderErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    '주문 생성에 실패했습니다.'
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const items = useCartStore((state) => state.items);
  const deliveryFee = useCartStore((state) => state.deliveryFee);
  const clearCart = useCartStore((state) => state.clearCart);
  const pushNotification = useNotificationStore(
    (state) => state.pushNotification
  );
  const addresses = useAddressBookStore((state) => state.addresses);
  const defaultAddressId = useAddressBookStore(
    (state) => state.defaultAddressId
  );
  const profile = useProfileStore((state) => state.profile);
  const saveProfile = useProfileStore((state) => state.saveProfile);

  const defaultAddress = useMemo(
    () => addresses.find((item) => item.id === defaultAddressId) ?? null,
    [addresses, defaultAddressId]
  );

  const [riderRequest, setRiderRequest] = useState('없음');
  const [storeRequest, setStoreRequest] = useState('');
  const [storeRequestDraft, setStoreRequestDraft] = useState('');
  const [noUtensils, setNoUtensils] = useState(false);
  const [noSideDish, setNoSideDish] = useState(false);
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isChangingNumber, setIsChangingNumber] = useState(false);
  const [newPhoneDraft, setNewPhoneDraft] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const uniqueStorePublicIds = useMemo(
    () => [
      ...new Set(
        items
          .map((item) => item?.storePublicId)
          .filter((id) => typeof id === 'string')
      ),
    ],
    [items]
  );

  const orderAmount = items.reduce(
    (acc, item) => acc + getItemUnitAmount(item) * (item?.quantity ?? 0),
    0
  );
  const totalAmount = orderAmount + deliveryFee;

  const buildStoreRequestString = () => {
    const parts = [];
    if (storeRequest !== '요청사항 없음') parts.push(storeRequest);
    if (noUtensils) parts.push('수저·포크 안 받기');
    if (noSideDish) parts.push('기본 반찬 안 받기');
    return parts.join(', ');
  };

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (items.length === 0) throw new Error('장바구니가 비어 있습니다.');
      if (uniqueStorePublicIds.length !== 1)
        throw new Error('현재는 한 가게의 메뉴만 주문할 수 있습니다.');

      const targetStorePublicId = uniqueStorePublicIds[0];
      let storeMenus = [];
      try {
        const response = await getStoreMenus(targetStorePublicId);
        storeMenus = Array.isArray(response) ? response : [];
      } catch (menuError) {
        if (menuError?.response?.status === 401) throw menuError;
      }

      const storeIdFromCart = items.find((item) =>
        isPositiveInteger(item?.storeId)
      )?.storeId;
      const resolvedStoreId =
        storeIdFromCart ?? getStoreIdFromMenus(storeMenus) ?? null;

      if (!isPositiveInteger(resolvedStoreId)) {
        throw new Error(
          'storeId를 확인할 수 없습니다. /api/stores/{storePublicId}/menus 응답에 store.id가 필요합니다.'
        );
      }

      const menus = items.map((item) => {
        const menuIdCandidates = [
          Number(item?.menuNumericId),
          Number(item?.menuId),
          getMenuIdFromMenus(storeMenus, item),
        ];
        const resolvedMenuId =
          menuIdCandidates.find((c) => isPositiveInteger(c)) ?? null;
        if (!isPositiveInteger(resolvedMenuId)) {
          throw new Error(
            `menuId를 확인할 수 없습니다: ${item?.menuName ?? '알 수 없는 메뉴'}`
          );
        }
        return {
          menuId: resolvedMenuId,
          menuName: item?.menuName ?? '메뉴',
          menuPrice: getItemUnitAmount(item),
          quantity: item?.quantity ?? 1,
        };
      });

      return createOrder({
        storeId: resolvedStoreId,
        menus,
        storeRequest: buildStoreRequestString(),
        riderRequest: riderRequest === '없음' ? '' : riderRequest,
        deliveryAddress: {
          roadAddress: defaultAddress?.roadAddress?.trim() ?? '',
          jibunAddress: defaultAddress?.jibunAddress?.trim() ?? '',
          detailAddress: defaultAddress?.detailAddress?.trim() ?? '',
        },
        paymentMethod: 'CARD',
      });
    },
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['my-payments'] });
      pushNotification({
        type: 'ORDER',
        title: '주문이 생성되었습니다.',
        description: '주문 내역에서 진행 상태를 확인해 주세요.',
      });
      navigate('/order-complete', {
        state: {
          items,
          address: defaultAddress
            ? `${defaultAddress.roadAddress}${defaultAddress.detailAddress ? ` ${defaultAddress.detailAddress}` : ''}`
            : '',
          riderRequest,
          orderAmount,
          deliveryFee,
          totalAmount,
        },
      });
    },
  });

  if (items.length === 0) {
    return (
      <div className="-mx-4 -mt-2 -mb-2 bg-white h-full flex flex-col items-center justify-center gap-3">
        <p className="text-[16px] font-medium text-[var(--color-semantic-label-alternative)]">
          주문할 메뉴가 없습니다.
        </p>
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="h-10 px-5 rounded-xl bg-[var(--color-atomic-redOrange-80)] text-white text-[14px] font-bold"
        >
          장바구니로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="-mx-4 -mt-2 -mb-2 bg-[var(--color-atomic-coolNeutral-97)] h-full flex flex-col min-h-0 relative overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {/* 담은 메뉴 */}
        <div className="bg-white px-4 pt-5 pb-4">
          <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)] mb-3">
            담은 메뉴
          </p>
          <div className="space-y-4">
            {items.map((item) => {
              const unitAmount = getItemUnitAmount(item);
              return (
                <div key={item.itemKey} className="flex gap-3">
                  <img
                    src={`https://picsum.photos/seed/menu-${encodeURIComponent(item.menuId)}/120/120`}
                    alt={item.menuName}
                    className="w-[60px] h-[60px] rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-[var(--color-semantic-label-normal)] leading-snug">
                      {item.menuName}
                    </p>
                    <p className="text-[14px] text-[var(--color-semantic-label-alternative)] mt-[2px]">
                      {formatAmount(unitAmount * (item?.quantity ?? 1))}
                    </p>
                    {item.basePriceAmount > 0 && (
                      <p className="text-[12px] text-[var(--color-semantic-label-alternative)] mt-[2px]">
                        가격 : {formatAmount(item.basePriceAmount)}
                      </p>
                    )}
                    {item.selectedOptions?.map((opt, i) => (
                      <p
                        key={i}
                        className="text-[12px] text-[var(--color-semantic-label-alternative)]"
                      >
                        {opt.groupName} : {opt.optionName}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 두꺼운 구분선 */}
        <div className="h-3 bg-[var(--color-atomic-coolNeutral-97)]" />

        {/* 배달 주소 + 라이더 요청사항 */}
        <div className="bg-white">
          <div className="px-4 py-5">
            <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)] mb-[12px]">
              배달 주소
            </p>
            <button
              type="button"
              onClick={() => navigate('/mypage/addresses')}
              className="w-full flex items-center gap-2 pb-2"
            >
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-[6px]">
                  <HomeIcon className="size-[14px] shrink-0 [&_path]:fill-[var(--color-semantic-label-normal)]" />
                  <p className="text-[14px] font-bold text-[var(--color-semantic-label-normal)]">
                    {defaultAddress?.label ?? '우리집'}
                  </p>
                </div>
                <p className="text-[13px] text-[var(--color-semantic-label-alternative)] leading-snug mt-[2px]">
                  {defaultAddress
                    ? `${defaultAddress.roadAddress}${defaultAddress.detailAddress ? ` ${defaultAddress.detailAddress}` : ''}`
                    : '주소를 등록해주세요'}
                </p>
              </div>
              <ArrowIcon className="size-5 shrink-0 -rotate-90 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
            </button>
          </div>

          <div className="mx-4 border-t border-[var(--color-semantic-line-normal-normal)]" />

          <div className="px-4 py-5">
            <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)] mb-[8px]">
              라이더 요청사항
            </p>
            <button
              type="button"
              onClick={() => setIsRiderModalOpen(true)}
              className="w-full flex items-center justify-between"
            >
              <span className="text-[14px] text-[var(--color-semantic-label-alternative)]">
                {riderRequest}
              </span>
              <ArrowIcon className="size-5 shrink-0 -rotate-90 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
            </button>
          </div>
        </div>

        {/* 두꺼운 구분선 */}
        <div className="h-3 bg-[var(--color-atomic-coolNeutral-97)]" />

        {/* 가게 요청사항 */}
        <div className="bg-white px-4 py-5">
          <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)] mb-3">
            가게 요청사항
          </p>
          <button
            type="button"
            onClick={() => {
              setStoreRequestDraft(storeRequest);
              setIsStoreModalOpen(true);
            }}
            className="w-full flex items-center justify-between"
          >
            <span
              className={`text-[14px] truncate mr-2 ${storeRequest ? 'text-[var(--color-semantic-label-normal)]' : 'text-[var(--color-semantic-label-alternative)]'}`}
            >
              {storeRequest || '요청사항 없음'}
            </span>
            <ArrowIcon className="size-5 shrink-0 -rotate-90 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
          </button>
          <div className="flex items-center gap-4 mt-4">
            {[
              {
                label: '수저 · 포크 안 받기',
                checked: noUtensils,
                onChange: setNoUtensils,
              },
              {
                label: '기본 반찬 안 받기',
                checked: noSideDish,
                onChange: setNoSideDish,
              },
            ].map(({ label, checked, onChange }) => (
              <button
                key={label}
                type="button"
                onClick={() => onChange(!checked)}
                className="flex items-center gap-[7px]"
              >
                <span
                  className={`w-[16px] h-[16px] rounded-[4px] border flex items-center justify-center shrink-0 ${
                    checked
                      ? 'bg-[var(--color-atomic-redOrange-80)] border-[var(--color-atomic-redOrange-80)]'
                      : 'bg-white border-[var(--color-semantic-line-normal-neutral)]'
                  }`}
                >
                  {checked && (
                    <CheckIcon className="size-[11px] [&_path]:fill-white" />
                  )}
                </span>
                <span
                  className={`text-[13px] ${checked ? 'text-[var(--color-atomic-redOrange-80)] font-medium' : 'text-[var(--color-semantic-label-alternative)]'}`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 두꺼운 구분선 */}
        <div className="h-3 bg-[var(--color-atomic-coolNeutral-97)]" />

        {/* 내 연락처 */}
        <div className="bg-white px-4 py-5">
          <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)] mb-3">
            내 연락처
          </p>
          <button
            type="button"
            onClick={() => {
              setIsChangingNumber(false);
              setNewPhoneDraft('');
              setVerificationSent(false);
              setVerificationCode('');
              setIsContactModalOpen(true);
            }}
            className="w-full flex items-center justify-between"
          >
            <span className="text-[14px] text-[var(--color-semantic-label-normal)]">
              {profile?.phoneNumber || '010-6659-5866'}
            </span>
            <ArrowIcon className="size-5 shrink-0 -rotate-90 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
          </button>
        </div>

        <div className="mx-4 border-t border-[var(--color-semantic-line-normal-normal)]" />

        {/* 결제수단 */}
        <div className="bg-white px-4 py-5">
          <p className="text-[18px] font-bold text-[var(--color-semantic-label-normal)] mb-3">
            결제수단
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-[var(--color-semantic-label-normal)]">
              신한카드 1234
            </span>
            <span className="text-[12px] text-[var(--color-semantic-label-alternative)]">
              신용/체크카드
            </span>
          </div>
        </div>

        {/* 두꺼운 구분선 */}
        <div className="h-3 bg-[var(--color-atomic-coolNeutral-97)]" />

        {/* 주문 금액 요약 */}
        <div className="bg-white px-4 pt-5 pb-4">
          <div className="space-y-[6px]">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[var(--color-semantic-label-alternative)]">
                주문 금액
              </span>
              <span className="text-[14px] text-[var(--color-semantic-label-normal)]">
                {formatAmount(orderAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[var(--color-semantic-label-alternative)]">
                배달비
              </span>
              <span className="text-[14px] text-[var(--color-semantic-label-normal)]">
                {formatAmount(deliveryFee)}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--color-semantic-line-normal-normal)] flex items-center justify-between">
            <span className="text-[16px] font-bold text-[var(--color-semantic-label-normal)]">
              결제금액
            </span>
            <span className="text-[18px] font-bold text-[var(--color-semantic-label-normal)]">
              {formatAmount(totalAmount)}
            </span>
          </div>
        </div>

        {/* 법적 동의 */}
        <div className="bg-[var(--color-atomic-coolNeutral-97)] px-4 py-5">
          {[
            '배달상품 주의사항 동의',
            '개인정보 제3자 제공 동의',
            '업주의 개인정보 처리 위탁 안내',
          ].map((text) => (
            <button
              key={text}
              type="button"
              className="w-full flex items-center justify-between py-[4px]"
            >
              <span className="text-[13px] text-[var(--color-semantic-label-alternative)]">
                {text}
              </span>
              <ArrowIcon className="size-4 -rotate-90 [&_path]:fill-[var(--color-semantic-label-alternative)]" />
            </button>
          ))}
        </div>

        {/* 에러 메시지 */}
        {createOrderMutation.isError && (
          <div className="bg-white px-4 pb-4">
            <p className="text-[13px] text-[var(--color-semantic-status-negative)]">
              {getOrderErrorMessage(createOrderMutation.error)}
            </p>
          </div>
        )}
      </div>

      {/* 하단 결제 버튼 */}
      <BottomSheet className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-medium text-[var(--color-semantic-label-alternative)]">
            결제예정금액
          </span>
          <p className="text-[22px] font-bold text-[var(--color-semantic-label-normal)]">
            {formatAmount(totalAmount)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => createOrderMutation.mutate()}
          disabled={
            createOrderMutation.isPending || uniqueStorePublicIds.length !== 1
          }
          className="w-full h-[48px] rounded-[10px] text-white text-[17px] font-bold disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--color-atomic-redOrange-80)]"
        >
          {createOrderMutation.isPending
            ? '주문 생성 중...'
            : `${formatAmount(totalAmount)} 결제하기`}
        </button>
      </BottomSheet>

      {/* 내 연락처 모달 */}
      <BottomModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="내 연락처"
        showClose={false}
      >
        <div className="px-4 pb-2">
          {/* 전화번호 행 */}
          <div className="flex items-center gap-2 h-10 px-3 rounded-lg bg-white border border-[var(--color-semantic-line-normal-normal)]">
            {isChangingNumber ? (
              <input
                type="tel"
                value={newPhoneDraft}
                onChange={(e) => setNewPhoneDraft(e.target.value)}
                placeholder="새 번호를 입력해주세요"
                className="flex-1 text-[14px] text-[var(--color-semantic-label-normal)] placeholder:text-[var(--color-semantic-label-alternative)] bg-transparent outline-none"
                autoFocus
              />
            ) : (
              <span className="flex-1 text-[14px] text-[var(--color-semantic-label-normal)]">
                {profile?.phoneNumber || '010-6659-5866'}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                if (isChangingNumber) {
                  setVerificationSent(true);
                  setVerificationCode('');
                } else {
                  setIsChangingNumber(true);
                  setNewPhoneDraft('');
                  setVerificationSent(false);
                  setVerificationCode('');
                }
              }}
              className="shrink-0 rounded-[4px] border border-[var(--color-semantic-line-normal-normal)] bg-white h-[28px] px-2 text-[12px] font-medium text-[var(--color-semantic-label-normal)]"
            >
              {isChangingNumber ? '인증번호 전송' : '번호 변경'}
            </button>
          </div>

          {/* 인증번호 입력 */}
          {verificationSent && (
            <div className="flex items-center gap-2 h-10 mt-2 px-3 rounded-lg bg-white border border-[var(--color-semantic-line-normal-normal)]">
              <input
                type="text"
                inputMode="numeric"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증번호를 입력해주세요"
                className="flex-1 text-[14px] text-[var(--color-semantic-label-normal)] placeholder:text-[var(--color-semantic-label-alternative)] bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setVerificationSent(true);
                  setVerificationCode('');
                }}
                className="shrink-0 rounded-[4px] border border-[var(--color-semantic-line-normal-normal)] bg-white h-[28px] px-2 text-[12px] font-medium text-[var(--color-semantic-label-normal)]"
              >
                재전송
              </button>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-2 mt-4 mb-2">
            {isChangingNumber && (
              <button
                type="button"
                onClick={() => {
                  setIsChangingNumber(false);
                  setVerificationSent(false);
                  setVerificationCode('');
                  setNewPhoneDraft('');
                }}
                className="flex-1 h-[48px] rounded-[10px] bg-[var(--color-atomic-coolNeutral-97)] text-[16px] font-medium text-[var(--color-semantic-label-normal)]"
              >
                취소
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (isChangingNumber && verificationCode) {
                  saveProfile({ phoneNumber: newPhoneDraft });
                }
                setIsContactModalOpen(false);
                setIsChangingNumber(false);
                setVerificationSent(false);
                setVerificationCode('');
              }}
              className="flex-1 h-[48px] rounded-[10px] bg-[var(--color-atomic-redOrange-80)] text-white text-[16px] font-medium"
            >
              완료
            </button>
          </div>
        </div>
      </BottomModal>

      {/* 라이더 요청사항 모달 */}
      <BottomModal
        isOpen={isRiderModalOpen}
        onClose={() => setIsRiderModalOpen(false)}
        title="라이더 요청사항"
      >
        <div className="px-5 pb-2">
          {[
            '없음',
            '문 앞에 두고 벨을 눌러주세요',
            '문 앞에 두고 전화 주세요',
            '경비실에 맡겨주세요',
            '직접 전화 드릴게요',
          ].map((option) => {
            const isSelected = riderRequest === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setRiderRequest(option);
                  setIsRiderModalOpen(false);
                }}
                className={`w-full flex items-center justify-between py-[10px] ${
                  isSelected
                    ? 'text-[var(--color-atomic-redOrange-80)]'
                    : 'text-[var(--color-semantic-label-normal)]'
                }`}
              >
                <span
                  className={`text-[14px] ${isSelected ? 'font-bold' : 'font-normal'}`}
                >
                  {option}
                </span>
                {isSelected && (
                  <CheckIcon className="size-[18px] shrink-0 [&_path]:fill-[var(--color-atomic-redOrange-80)]" />
                )}
              </button>
            );
          })}
        </div>
      </BottomModal>

      {/* 가게 요청사항 모달 */}
      <BottomModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        title="가게 요청사항"
        showClose={false}
      >
        <div className="px-4 pb-2">
          <textarea
            value={storeRequestDraft}
            onChange={(e) => setStoreRequestDraft(e.target.value.slice(0, 50))}
            placeholder="예) 견과류 빼주세요"
            className="w-full h-[110px] px-3 py-3 rounded-xl bg-white border border-[var(--color-semantic-line-normal-normal)] text-[14px] text-[var(--color-semantic-label-normal)] placeholder:text-[var(--color-semantic-label-alternative)] outline-none resize-none"
          />
          <p className="text-right text-[12px] text-[var(--color-semantic-label-alternative)] mt-1">
            {storeRequestDraft.length}/50
          </p>
          <button
            type="button"
            onClick={() => {
              setStoreRequest(storeRequestDraft.trim());
              setIsStoreModalOpen(false);
            }}
            className="w-[328px] h-[48px] mt-3 rounded-xl bg-[var(--color-atomic-redOrange-80)] text-white text-[16px] font-normal"
          >
            저장
          </button>
        </div>
      </BottomModal>
    </div>
  );
}
