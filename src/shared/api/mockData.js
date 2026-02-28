const DEFAULT_STORE_PUBLIC_ID = '11111111-1111-4111-8111-111111111111';
const MOCK_USER_ID = 101;
const MOCK_RIDER_ID = 201;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

function toPositiveInteger(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

function createUuid() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (token) => {
    const random = Math.floor(Math.random() * 16);
    const next = token === 'x' ? random : (random & 0x3) | 0x8;
    return next.toString(16);
  });
}

function createToken(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

function normalizeComment(value) {
  if (typeof value === 'string') return value.trim();
  if (typeof value?.comment === 'string') return value.comment.trim();
  return '';
}

function normalizeImageUrls(value) {
  const rawList = Array.isArray(value)
    ? value
    : Array.isArray(value?.images)
      ? value.images
      : [];

  return rawList
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveStoreNameById(storeId, fallbackName) {
  const target = mockState.stores.find((store) => store.id === storeId);
  if (target) return target.storeName;
  return fallbackName ?? 'Mock 치킨집';
}

function buildDefaultMenus(storeId, startMenuId) {
  return [
    {
      id: startMenuId,
      storeId,
      store: { id: storeId },
      menuName: '후라이드 치킨',
      menuDescription: '겉바속촉 기본 후라이드',
      price: { amount: 18000 },
      menuOptionGroups: [
        {
          id: `${startMenuId}-g1`,
          groupName: '추가 선택',
          maxSelectableCount: 2,
          options: [
            { name: '콜라 500ml', optionPrice: { amount: 2000 } },
            { name: '치즈볼 5개', optionPrice: { amount: 3500 } },
            { name: '소스 추가', optionPrice: { amount: 500 } },
          ],
        },
      ],
    },
    {
      id: startMenuId + 1,
      storeId,
      store: { id: storeId },
      menuName: '양념 치킨',
      menuDescription: '달콤한 특제 양념소스',
      price: { amount: 20000 },
      menuOptionGroups: [
        {
          id: `${startMenuId + 1}-g1`,
          groupName: '맵기 선택',
          maxSelectableCount: 1,
          options: [
            { name: '기본', optionPrice: { amount: 0 } },
            { name: '매운맛', optionPrice: { amount: 500 } },
          ],
        },
      ],
    },
    {
      id: startMenuId + 2,
      storeId,
      store: { id: storeId },
      menuName: '감자튀김',
      menuDescription: '사이드 메뉴',
      price: { amount: 4000 },
      menuOptionGroups: [],
    },
  ];
}

function buildStore({
  id,
  storePublicId,
  storeName,
  storeCategory = 'CHICKEN',
  thumbnailUrl,
  minimumOrderAmount = { amount: 15000 },
  deliveryFee = { amount: 3000 },
  menus,
}) {
  return {
    id,
    storePublicId,
    storeName,
    storeCategory,
    thumbnailUrl:
      thumbnailUrl ??
      `https://picsum.photos/seed/store-${encodeURIComponent(storePublicId)}/800/500`,
    minimumOrderAmount,
    deliveryFee,
    totalRating: 0,
    reviewCount: 0,
    menus: Array.isArray(menus) ? menus : buildDefaultMenus(id, 1),
    recentPhotoReviews: [],
  };
}

function buildStoreReview({
  publicId,
  storePublicId,
  storeName,
  rating,
  createdAt,
  comment,
  images,
}) {
  return {
    publicId,
    storePublicId,
    storeName,
    rating,
    createdAt,
    storeReviewComment: comment,
    storeReviewImages: images,
    StoreReviewImages: images,
  };
}

function buildMyReview(review) {
  return {
    publicStoreReviewId: review.publicId,
    storePublicId: review.storePublicId,
    storeName: review.storeName,
    rating: review.rating,
    createdAt: review.createdAt,
    storeReviewComment: review.storeReviewComment,
    orderMenuImages: review.storeReviewImages,
  };
}

function buildPayment({
  paymentId,
  orderId,
  storeName,
  paymentStatus,
  amount,
  paymentKey,
  createdAt,
  orderMenus,
  storeImages,
  rating,
  storeReviewComment,
}) {
  return {
    paymentId,
    orderId,
    userId: MOCK_USER_ID,
    storeName,
    paymentStatus,
    status: paymentStatus,
    amount,
    paymentKey,
    transactionId: null,
    createdAt,
    orderMenus,
    storeImages: Array.isArray(storeImages) ? storeImages : [],
    rating,
    storeReviewComment,
  };
}

const seedStore = buildStore({
  id: 1,
  storePublicId: DEFAULT_STORE_PUBLIC_ID,
  storeName: 'Mock 바삭치킨',
  menus: buildDefaultMenus(1, 1),
});

const seedStoreReviews = [
  buildStoreReview({
    publicId: '33333333-3333-4333-8333-333333333333',
    storePublicId: DEFAULT_STORE_PUBLIC_ID,
    storeName: seedStore.storeName,
    rating: 5,
    createdAt: '2026-02-27T09:30:00.000Z',
    comment: '치킨이 바삭하고 배달도 빨랐어요.',
    images: ['https://picsum.photos/seed/review-1/480/320'],
  }),
  buildStoreReview({
    publicId: '44444444-4444-4444-8444-444444444444',
    storePublicId: DEFAULT_STORE_PUBLIC_ID,
    storeName: seedStore.storeName,
    rating: 4,
    createdAt: '2026-02-26T11:45:00.000Z',
    comment: '양념이 달달해서 아이들도 좋아해요.',
    images: ['https://picsum.photos/seed/review-2/480/320'],
  }),
];

const mockState = {
  nextStoreId: 2,
  nextMenuId: 100,
  nextOrderId: 5000,
  nextPaymentId: 7000,
  stores: [seedStore],
  storeReviewsByStoreId: {
    [DEFAULT_STORE_PUBLIC_ID]: seedStoreReviews,
  },
  myReviews: seedStoreReviews.map((review) => buildMyReview(review)),
  payments: [
    buildPayment({
      paymentId: 6101,
      orderId: 4001,
      storeName: seedStore.storeName,
      paymentStatus: 'APPROVED',
      amount: 24000,
      paymentKey: 'mock_payment_6101',
      createdAt: '2026-02-27T08:20:00.000Z',
      orderMenus: [
        { menuName: '후라이드 치킨', quantity: 1, price: 18000 },
        { menuName: '감자튀김', quantity: 1, price: 4000 },
      ],
      storeImages: [seedStore.thumbnailUrl],
      rating: 5,
      storeReviewComment: '다시 주문할게요.',
    }),
    buildPayment({
      paymentId: 6102,
      orderId: 4002,
      storeName: seedStore.storeName,
      paymentStatus: 'REQUESTED',
      amount: 20000,
      paymentKey: 'mock_payment_6102',
      createdAt: '2026-02-27T12:00:00.000Z',
      orderMenus: [{ menuName: '양념 치킨', quantity: 1, price: 20000 }],
      storeImages: [seedStore.thumbnailUrl],
    }),
    buildPayment({
      paymentId: 6103,
      orderId: 4003,
      storeName: seedStore.storeName,
      paymentStatus: 'FAILED',
      amount: 18000,
      paymentKey: 'mock_payment_6103',
      createdAt: '2026-02-25T15:10:00.000Z',
      orderMenus: [{ menuName: '후라이드 치킨', quantity: 1, price: 18000 }],
      storeImages: [seedStore.thumbnailUrl],
    }),
  ],
};

function getReviewsByStoreId(storePublicId) {
  if (!mockState.storeReviewsByStoreId[storePublicId]) {
    mockState.storeReviewsByStoreId[storePublicId] = [];
  }
  return mockState.storeReviewsByStoreId[storePublicId];
}

function recalculateStoreStats(storePublicId) {
  const targetStore = mockState.stores.find(
    (store) => store.storePublicId === storePublicId
  );
  if (!targetStore) return;

  const reviews = getReviewsByStoreId(storePublicId);
  const reviewCount = reviews.length;
  const totalRating = reviews.reduce(
    (sum, review) => sum + (review?.rating ?? 0),
    0
  );

  targetStore.reviewCount = reviewCount;
  targetStore.totalRating =
    reviewCount === 0 ? 0 : Number((totalRating / reviewCount).toFixed(1));
  targetStore.recentPhotoReviews = reviews
    .filter(
      (review) =>
        Array.isArray(review?.storeReviewImages) &&
        review.storeReviewImages.length > 0
    )
    .slice(0, 4)
    .map((review) => ({
      thumbnailImages: review.storeReviewImages[0],
      storeReviewComment: review.storeReviewComment,
      rating: review.rating,
    }));
}

function recalculateAllStoreStats() {
  for (const store of mockState.stores) {
    recalculateStoreStats(store.storePublicId);
  }
}

function createDynamicStore(storePublicId) {
  const nextStoreId = mockState.nextStoreId;
  mockState.nextStoreId += 1;

  const menus = buildDefaultMenus(nextStoreId, mockState.nextMenuId);
  mockState.nextMenuId += menus.length + 1;

  const suffix = storePublicId.slice(0, 4);
  const store = buildStore({
    id: nextStoreId,
    storePublicId,
    storeName: `Mock 가게 ${suffix}`,
    menus,
  });

  mockState.stores.push(store);
  mockState.storeReviewsByStoreId[storePublicId] = [];
  recalculateStoreStats(storePublicId);
  return store;
}

function ensureStore(storePublicId) {
  if (!storePublicId || typeof storePublicId !== 'string') {
    return mockState.stores[0];
  }

  const trimmedStorePublicId = storePublicId.trim();
  if (!trimmedStorePublicId) return mockState.stores[0];

  const existing = mockState.stores.find(
    (store) => store.storePublicId === trimmedStorePublicId
  );
  if (existing) return existing;

  return createDynamicStore(trimmedStorePublicId);
}

function sortedPayments() {
  return [...mockState.payments].sort((left, right) => {
    const leftTime = new Date(left?.createdAt ?? '').getTime();
    const rightTime = new Date(right?.createdAt ?? '').getTime();
    return rightTime - leftTime;
  });
}

function findReviewByPublicId(publicReviewId) {
  for (const reviews of Object.values(mockState.storeReviewsByStoreId)) {
    const found = reviews.find((review) => review.publicId === publicReviewId);
    if (found) return found;
  }

  const foundFromMine = mockState.myReviews.find(
    (review) => review.publicStoreReviewId === publicReviewId
  );
  if (!foundFromMine) return null;

  return buildStoreReview({
    publicId: foundFromMine.publicStoreReviewId,
    storePublicId: foundFromMine.storePublicId,
    storeName: foundFromMine.storeName,
    rating: foundFromMine.rating,
    createdAt: foundFromMine.createdAt,
    comment: foundFromMine.storeReviewComment ?? '',
    images: normalizeImageUrls(foundFromMine.orderMenuImages),
  });
}

function toReviewDetail(review, fallbackPublicId) {
  const images = normalizeImageUrls(
    review?.storeReviewImages ??
      review?.StoreReviewImages ??
      review?.orderMenuImages
  );
  const comment = normalizeComment(review?.storeReviewComment);

  return {
    publicId:
      review?.publicId ?? review?.publicStoreReviewId ?? fallbackPublicId,
    storePublicId: review?.storePublicId ?? DEFAULT_STORE_PUBLIC_ID,
    rating: review?.rating ?? 0,
    createdAt: review?.createdAt ?? nowIso(),
    storeReviewComment: { comment },
    storeReviewImages: images,
    orderMenuImages: images,
  };
}

recalculateAllStoreStats();

function signupUser(payload) {
  return clone({
    userId: MOCK_USER_ID,
    email: payload?.email ?? 'mock-user@baedariyo.com',
    nickname: payload?.nickname ?? 'mock-user',
  });
}

function signupRider(payload) {
  return clone({
    riderId: MOCK_RIDER_ID,
    email: payload?.email ?? 'mock-rider@baedariyo.com',
    nickname: payload?.nickname ?? 'mock-rider',
    vehicleType: payload?.vehicleType ?? 'MOTORCYCLE',
  });
}

function loginUser(payload) {
  return clone({
    accessToken: createToken('mock-user-access'),
    refreshToken: createToken('mock-user-refresh'),
    userId: MOCK_USER_ID,
    email: payload?.email ?? 'mock-user@baedariyo.com',
  });
}

function loginRider(payload) {
  return clone({
    accessToken: createToken('mock-rider-access'),
    refreshToken: createToken('mock-rider-refresh'),
    riderId: MOCK_RIDER_ID,
    email: payload?.email ?? 'mock-rider@baedariyo.com',
  });
}

function withdrawUser() {
  return clone({ success: true });
}

function withdrawRider() {
  return clone({ success: true });
}

function createStore(payload) {
  const nextStoreId = mockState.nextStoreId;
  mockState.nextStoreId += 1;

  const storePublicId = createUuid();
  const menus = buildDefaultMenus(nextStoreId, mockState.nextMenuId);
  mockState.nextMenuId += menus.length + 1;

  const store = buildStore({
    id: nextStoreId,
    storePublicId,
    storeName: payload?.storeName?.trim() || `Mock 가게 ${nextStoreId}`,
    storeCategory: payload?.storeCategory ?? 'CHICKEN',
    thumbnailUrl:
      typeof payload?.thumbnailUrl === 'string' && payload.thumbnailUrl.trim()
        ? payload.thumbnailUrl.trim()
        : undefined,
    minimumOrderAmount: payload?.minimumOrderAmount ?? { amount: 15000 },
    deliveryFee: payload?.deliveryFee ?? { amount: 3000 },
    menus,
  });

  mockState.stores.unshift(store);
  mockState.storeReviewsByStoreId[storePublicId] = [];

  return clone({
    storePublicId: store.storePublicId,
    storeName: store.storeName,
    storeCategory: store.storeCategory,
    thumbnailUrl: store.thumbnailUrl,
    minimumOrderAmount: store.minimumOrderAmount,
    deliveryFee: store.deliveryFee,
    reviewCount: store.reviewCount,
    totalRating: store.totalRating,
  });
}

function getStoreDetail(storePublicId) {
  const store = ensureStore(storePublicId);
  recalculateStoreStats(store.storePublicId);
  return clone(store);
}

function getStoreMenus(storePublicId) {
  const store = ensureStore(storePublicId);
  return clone(store.menus);
}

function getStoreReviews(storePublicId) {
  const store = ensureStore(storePublicId);
  const reviews = getReviewsByStoreId(store.storePublicId);
  return clone(reviews);
}

function createStoreReview(storePublicId, payload) {
  const store = ensureStore(storePublicId);
  const publicId = createUuid();
  const rating = Math.max(1, Math.min(5, Number(payload?.rating) || 5));
  const createdAt = nowIso();
  const comment = normalizeComment(payload?.storeReviewComment);
  const images = normalizeImageUrls(payload?.storeReviewImages);

  const review = buildStoreReview({
    publicId,
    storePublicId: store.storePublicId,
    storeName: store.storeName,
    rating,
    createdAt,
    comment,
    images,
  });
  const myReview = buildMyReview(review);

  getReviewsByStoreId(store.storePublicId).unshift(review);
  mockState.myReviews.unshift(myReview);
  recalculateStoreStats(store.storePublicId);

  return clone({
    publicId,
    storePublicId: store.storePublicId,
    rating,
    createdAt,
  });
}

function getMyReviews() {
  return clone(mockState.myReviews);
}

function getReviewDetail(publicStoreReviewId) {
  const found = findReviewByPublicId(publicStoreReviewId);
  if (!found) {
    return clone(
      toReviewDetail(
        {
          publicId: publicStoreReviewId,
          storePublicId: DEFAULT_STORE_PUBLIC_ID,
          storeName: resolveStoreNameById(1, 'Mock 바삭치킨'),
          rating: 0,
          createdAt: nowIso(),
          storeReviewComment: 'mock 리뷰 데이터입니다.',
          storeReviewImages: [],
        },
        publicStoreReviewId
      )
    );
  }

  return clone(toReviewDetail(found, publicStoreReviewId));
}

function deleteMyReview(publicStoreReviewId) {
  mockState.myReviews = mockState.myReviews.filter(
    (review) => review.publicStoreReviewId !== publicStoreReviewId
  );

  for (const [storePublicId, reviews] of Object.entries(
    mockState.storeReviewsByStoreId
  )) {
    mockState.storeReviewsByStoreId[storePublicId] = reviews.filter(
      (review) => review.publicId !== publicStoreReviewId
    );
    recalculateStoreStats(storePublicId);
  }

  return clone({ deleted: true, publicStoreReviewId });
}

function createOrder(payload) {
  const orderId = mockState.nextOrderId;
  const paymentId = mockState.nextPaymentId;
  mockState.nextOrderId += 1;
  mockState.nextPaymentId += 1;

  const storeId = toPositiveInteger(payload?.storeId) ?? 1;
  const storeName = resolveStoreNameById(storeId, 'Mock 치킨집');
  const orderMenus = Array.isArray(payload?.menus)
    ? payload.menus.map((menu) => ({
        menuName: menu?.menuName ?? '메뉴',
        quantity: toPositiveInteger(menu?.quantity) ?? 1,
        price: toPositiveInteger(menu?.menuPrice) ?? 0,
      }))
    : [];
  const amount = orderMenus.reduce(
    (sum, menu) => sum + (menu.price ?? 0) * (menu.quantity ?? 0),
    0
  );

  const payment = buildPayment({
    paymentId,
    orderId,
    storeName,
    paymentStatus: 'READY',
    amount,
    paymentKey: `mock_order_payment_${paymentId}`,
    createdAt: nowIso(),
    orderMenus,
    storeImages: [`https://picsum.photos/seed/order-store-${storeId}/800/500`],
  });

  mockState.payments.unshift(payment);

  return clone({
    orderId,
    paymentId,
    paymentStatus: payment.paymentStatus,
    amount,
  });
}

function assignRiderToOrder(payload) {
  return clone({
    orderId: toPositiveInteger(payload?.orderId),
    riderId: MOCK_RIDER_ID,
    assigned: true,
  });
}

function createPayment(payload) {
  const paymentId = mockState.nextPaymentId;
  mockState.nextPaymentId += 1;

  const orderId = toPositiveInteger(payload?.orderId) ?? mockState.nextOrderId;
  const amount = toPositiveInteger(payload?.amount) ?? 0;
  const paymentKey =
    typeof payload?.paymentKey === 'string' && payload.paymentKey.trim()
      ? payload.paymentKey.trim()
      : `mock_payment_${paymentId}`;

  const payment = buildPayment({
    paymentId,
    orderId,
    storeName: 'Mock 결제 상점',
    paymentStatus: 'REQUESTED',
    amount,
    paymentKey,
    createdAt: nowIso(),
    orderMenus: [{ menuName: '테스트 메뉴', quantity: 1, price: amount }],
    storeImages: ['https://picsum.photos/seed/mock-payment/800/500'],
  });

  mockState.payments.unshift(payment);
  return paymentId;
}

function updatePaymentStatus(paymentId, nextStatus, transactionId) {
  const targetPayment = mockState.payments.find(
    (payment) => payment.paymentId === paymentId
  );

  if (!targetPayment) {
    return clone({
      paymentId,
      status: nextStatus,
    });
  }

  targetPayment.paymentStatus = nextStatus;
  targetPayment.status = nextStatus;
  if (transactionId) {
    targetPayment.transactionId = transactionId;
  }

  return clone({
    paymentId: targetPayment.paymentId,
    status: targetPayment.paymentStatus,
    transactionId: targetPayment.transactionId,
  });
}

function approvePayment(paymentId, payload) {
  return updatePaymentStatus(paymentId, 'APPROVED', payload?.transactionId);
}

function failPayment(paymentId) {
  return updatePaymentStatus(paymentId, 'FAILED');
}

function cancelPayment(paymentId) {
  return updatePaymentStatus(paymentId, 'CANCELED');
}

function getPaymentDetail(paymentId) {
  const targetPayment = mockState.payments.find(
    (payment) => payment.paymentId === paymentId
  );

  if (!targetPayment) {
    return clone({
      paymentId,
      orderId: null,
      userId: MOCK_USER_ID,
      amount: 0,
      paymentKey: '',
      status: 'READY',
      createdAt: nowIso(),
    });
  }

  return clone({
    paymentId: targetPayment.paymentId,
    orderId: targetPayment.orderId,
    userId: targetPayment.userId,
    amount: targetPayment.amount,
    paymentKey: targetPayment.paymentKey,
    status: targetPayment.paymentStatus,
    createdAt: targetPayment.createdAt,
    transactionId: targetPayment.transactionId,
  });
}

function getMyPayments(status) {
  const payments = sortedPayments();
  if (!status) return clone(payments);

  return clone(
    payments.filter((payment) => payment.paymentStatus === status.trim())
  );
}

export const mockApi = {
  signupUser,
  signupRider,
  loginUser,
  loginRider,
  withdrawUser,
  withdrawRider,
  createStore,
  getStoreDetail,
  getStoreMenus,
  getStoreReviews,
  createStoreReview,
  getMyReviews,
  getReviewDetail,
  deleteMyReview,
  createOrder,
  assignRiderToOrder,
  createPayment,
  approvePayment,
  failPayment,
  cancelPayment,
  getPaymentDetail,
  getMyPayments,
};
