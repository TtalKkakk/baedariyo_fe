export const PAYMENT_STATUS_FILTERS = [
  { key: 'ALL', label: '전체' },
  { key: 'READY', label: '생성됨' },
  { key: 'REQUESTED', label: '결제요청' },
  { key: 'APPROVED', label: '결제완료' },
  { key: 'FAILED', label: '실패' },
  { key: 'CANCELED', label: '취소' },
];

function hashText(value) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash.toString(36);
}

function getMenuSignature(orderMenus) {
  if (!Array.isArray(orderMenus) || orderMenus.length === 0) return 'no-menu';

  return orderMenus
    .map((menu) => {
      const menuName = menu?.menuName ?? '';
      const quantity = menu?.quantity ?? 0;
      const price = menu?.price ?? 0;
      return `${menuName}:${quantity}:${price}`;
    })
    .join('|');
}

export function getPaymentRouteId(payment) {
  const timestamp = new Date(payment?.createdAt ?? '').getTime();
  const safeTimestamp = Number.isNaN(timestamp) ? '0' : timestamp.toString(36);

  const fingerprint = [
    payment?.storeName ?? '',
    payment?.amount ?? '',
    payment?.createdAt ?? '',
    getMenuSignature(payment?.orderMenus),
  ].join('__');

  return `p-${safeTimestamp}-${hashText(fingerprint)}`;
}

export function getPaymentStatusLabel(status) {
  return (
    PAYMENT_STATUS_FILTERS.find((item) => item.key === status)?.label ?? status
  );
}

export function getPaymentStatusClassName(status) {
  if (status === 'APPROVED') {
    return 'bg-[var(--color-atomic-blue-95)] text-[var(--color-atomic-blue-65)]';
  }
  if (status === 'FAILED' || status === 'CANCELED') {
    return 'bg-[var(--color-atomic-redOrange-99)] text-[var(--color-semantic-status-cautionary)]';
  }
  return 'bg-[var(--color-semantic-background-normal-normal)] text-[var(--color-semantic-label-alternative)]';
}

export function formatPaymentAmount(amount) {
  if (typeof amount !== 'number') return '-';
  return `${amount.toLocaleString('ko-KR')}원`;
}

export function formatPaymentDateTime(value) {
  if (!value) return '-';

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return parsedDate.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getPaymentErrorMessage(error, fallbackMessage) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    fallbackMessage ??
    '주문 정보를 불러오지 못했습니다.'
  );
}
