const DEFAULT_STORE_PUBLIC_ID = '11111111-1111-4111-8111-111111111111';

// 카테고리별 Unsplash 이미지
const IMG = {
  // 가게 썸네일 (800×500)
  cafe1:
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=500&fit=crop',
  cafe2:
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=500&fit=crop',
  cafe3:
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=500&fit=crop',
  bingsu:
    'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=800&h=500&fit=crop',
  maratang1:
    'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&h=500&fit=crop',
  maratang2:
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=500&fit=crop',
  maratang3:
    'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&h=500&fit=crop',
  chinese:
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=500&fit=crop',
  chicken:
    'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&h=500&fit=crop',
  // 메뉴 썸네일 (400×400)
  menuAmericano:
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop',
  menuLatte:
    'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&h=400&fit=crop',
  menuVanillaLatte:
    'https://images.unsplash.com/photo-1542990253-a781e9db9e3e?w=400&h=400&fit=crop',
  menuCreamCoffee:
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
  menuStrawberryLatte:
    'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=400&fit=crop',
  menuAde:
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop',
  menuIcedTea:
    'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
  menuMaratang:
    'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=400&fit=crop',
  menuXiaochao:
    'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=400&fit=crop',
  menuGwobaorou:
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop',
  menuNoodle:
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop',
  menuFriedRice:
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop',
  menuDumpling:
    'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=400&fit=crop',
  menuFriedChicken:
    'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=400&fit=crop',
  menuSeasonedChicken:
    'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&h=400&fit=crop',
  menuFries:
    'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=400&fit=crop',
  menuColeslaw:
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
  menuCheeseBall:
    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop',
  menuCola:
    'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=400&fit=crop',
  menuBeer:
    'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=400&fit=crop',
};

const SEARCH_RESULT_STORES = [
  {
    storePublicId: 'bb000001-0000-4000-8000-000000000001',
    storeName: '백억커피 구로고척점',
    description: '아메리카노, 백억 김치볶음밥, 블루베리 요거트, 카페라떼',
    storeCategory: 'CAFE_DESSERT',
    thumbnailUrl: IMG.cafe1,
    totalRating: 4.8,
    reviewCount: 222,
    deliveryFee: { amount: 1300 },
    minimumOrderAmount: { amount: 11000 },
    deliveryTimeMin: 21,
  },
  {
    storePublicId: 'bb000002-0000-4000-8000-000000000002',
    storeName: '백다방 동양미래대점',
    description: '바닐라라떼(ICED), 아이스티샷추가(아...',
    storeCategory: 'CAFE_DESSERT',
    thumbnailUrl: IMG.cafe2,
    totalRating: 5.0,
    reviewCount: 820,
    deliveryFee: { amount: 500 },
    minimumOrderAmount: { amount: 10000 },
    deliveryTimeMin: 18,
  },
  {
    storePublicId: 'bb000003-0000-4000-8000-000000000003',
    storeName: '카페인중독 목동점',
    description: '[시그니처] 햅쌀 와플, 로제 컵떡볶이',
    storeCategory: 'CAFE_DESSERT',
    thumbnailUrl: IMG.cafe3,
    totalRating: 4.7,
    reviewCount: 252,
    deliveryFee: { amount: 4800 },
    minimumOrderAmount: { amount: 17900 },
    deliveryTimeMin: 43,
  },
  {
    storePublicId: 'bb000004-0000-4000-8000-000000000004',
    storeName: '설빙 오류동역점',
    description: '생딸기 설빙, 순수요거생딸기설빙',
    storeCategory: 'CAFE_DESSERT',
    thumbnailUrl: IMG.bingsu,
    totalRating: 5.0,
    reviewCount: 942,
    deliveryFee: { amount: 3700 },
    minimumOrderAmount: { amount: 10800 },
    deliveryTimeMin: 12,
  },
  {
    storePublicId: 'aa000001-0000-4000-8000-000000000001',
    storeName: '마라탕전문 상츠마라 신도림점',
    description:
      'Self 마라탕 1인분, 꿔바로우 미니, 마라샹궈, 마라 로제 샹궈, 온면, 2~3인분 마라탕',
    storeCategory: 'CHINESE',
    thumbnailUrl: IMG.maratang1,
    totalRating: 4.1,
    reviewCount: 28000,
    deliveryFee: { amount: 5000 },
    minimumOrderAmount: { amount: 9800 },
    deliveryTimeMin: 30,
  },
  {
    storePublicId: 'aa000002-0000-4000-8000-000000000002',
    storeName: '마라공방 고척돔점',
    description:
      'Self 마라탕 1인분, 꿔바로우 미니, 마라샹궈, 마라 로제 샹궈, 온면, 2~3인분 마라탕',
    storeCategory: 'CHINESE',
    thumbnailUrl: IMG.maratang2,
    totalRating: 4.9,
    reviewCount: 45000,
    deliveryFee: { amount: 3500 },
    minimumOrderAmount: { amount: 15100 },
    deliveryTimeMin: 16,
  },
  {
    storePublicId: 'aa000003-0000-4000-8000-000000000003',
    storeName: '취향마라탕&마라샹궈',
    description:
      'Self 마라탕 1인분, 꿔바로우 미니, 마라샹궈, 마라 로제 샹궈, 온면, 2~3인분 마라탕',
    storeCategory: 'CHINESE',
    thumbnailUrl: IMG.maratang3,
    totalRating: 4.5,
    reviewCount: 847,
    deliveryFee: { amount: 6000 },
    minimumOrderAmount: { amount: 12000 },
    deliveryTimeMin: 25,
  },
  {
    storePublicId: 'aa000004-0000-4000-8000-000000000004',
    storeName: '용용선생 영등포점',
    description:
      'Self 마라탕 1인분, 꿔바로우 미니, 마라샹궈, 마라 로제 샹궈, 온면, 2~3인분 마라탕',
    storeCategory: 'CHINESE',
    thumbnailUrl: IMG.maratang1,
    totalRating: 5.0,
    reviewCount: 942,
    deliveryFee: { amount: 3700 },
    minimumOrderAmount: { amount: 10800 },
    deliveryTimeMin: 12,
  },
  {
    storePublicId: 'aa000005-0000-4000-8000-000000000005',
    storeName: '추리 마라탕 & 궈바로우',
    description:
      'Self 마라탕 1인분, 꿔바로우 미니, 마라샹궈, 마라 로제 샹궈, 온면, 2~3인분 마라탕',
    storeCategory: 'CHINESE',
    thumbnailUrl: IMG.maratang2,
    totalRating: 4.3,
    reviewCount: 1200,
    deliveryFee: { amount: 2000 },
    minimumOrderAmount: { amount: 13000 },
    deliveryTimeMin: 20,
  },
  {
    storePublicId: 'aa000006-0000-4000-8000-000000000006',
    storeName: '마라도 마라탕',
    description: '직접 만든 마라소스, 신선한 재료, 매운맛 조절 가능',
    storeCategory: 'CHINESE',
    thumbnailUrl: IMG.maratang3,
    totalRating: 4.7,
    reviewCount: 3200,
    deliveryFee: { amount: 0 },
    minimumOrderAmount: { amount: 11000 },
    deliveryTimeMin: 22,
  },
  {
    storePublicId: 'aa000007-0000-4000-8000-000000000007',
    storeName: '마라 헤이 신림점',
    description: '마라탕, 마라샹궈, 꿔바로우 전문점',
    storeCategory: 'CHINESE',
    thumbnailUrl: IMG.maratang1,
    totalRating: 4.2,
    reviewCount: 520,
    deliveryFee: { amount: 4000 },
    minimumOrderAmount: { amount: 10000 },
    deliveryTimeMin: 35,
  },
  {
    storePublicId: 'aa000008-0000-4000-8000-000000000008',
    storeName: '홍콩반점0410 관악점',
    description: '짜장면, 짬뽕, 탕수육 전문 중화요리 레스토랑',
    storeCategory: 'CHINESE',
    thumbnailUrl: IMG.chinese,
    totalRating: 4.6,
    reviewCount: 8900,
    deliveryFee: { amount: 2500 },
    minimumOrderAmount: { amount: 14000 },
    deliveryTimeMin: 28,
  },
];

function searchStores({ keyword, storeCategory, page = 0, size = 20 } = {}) {
  const q = (keyword ?? '').trim().toLowerCase();
  let filtered = SEARCH_RESULT_STORES;
  if (storeCategory) {
    filtered = filtered.filter((s) => s.storeCategory === storeCategory);
  }
  if (q) {
    filtered = filtered.filter(
      (s) =>
        s.storeName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }
  const start = page * size;
  const paged = filtered.slice(start, start + size);
  return clone({ stores: paged, totalCount: filtered.length });
}

function getSearchHistory(limit = 5) {
  return clone(
    ['처갓집양념치킨', '메가커피', '춘', '마라탕', '치킨'].slice(0, limit)
  );
}
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
      menuDescription: '겉바속촉 기본 후라이드. 저희 가게 대표 메뉴입니다.',
      thumbnailUrl: IMG.menuFriedChicken,
      price: { amount: 0 },
      reviewCount: 107,
      menuOptionGroups: [
        {
          id: `${startMenuId}-g1`,
          groupName: '가격',
          maxSelectableCount: 1,
          absolutePrice: true,
          options: [
            {
              name: '미니 6조각',
              optionPrice: { amount: 9900 },
              isPopular: false,
            },
            {
              name: '중 10조각',
              optionPrice: { amount: 13900 },
              isPopular: true,
            },
            {
              name: '대 16조각',
              optionPrice: { amount: 18900 },
              isPopular: false,
            },
          ],
        },
        {
          id: `${startMenuId}-g1b`,
          groupName: '맵기 선택',
          maxSelectableCount: 1,
          absolutePrice: false,
          options: [
            { name: '기본', optionPrice: { amount: 0 }, isPopular: false },
            { name: '매운맛', optionPrice: { amount: 500 }, isPopular: false },
          ],
        },
        {
          id: `${startMenuId}-g2`,
          groupName: '음료 추가',
          maxSelectableCount: 3,
          absolutePrice: false,
          options: [
            {
              name: '코카콜라',
              optionPrice: { amount: 2000 },
              isPopular: true,
            },
            {
              name: '코카콜라 제로',
              optionPrice: { amount: 2000 },
              isPopular: false,
            },
            { name: '사이다', optionPrice: { amount: 2000 }, isPopular: false },
            {
              name: '환타 오렌지맛',
              optionPrice: { amount: 2000 },
              isPopular: false,
            },
            { name: '차이티', optionPrice: { amount: 3000 }, isPopular: false },
            { name: '뻥홍차', optionPrice: { amount: 3000 }, isPopular: false },
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
      thumbnailUrl: IMG.menuSeasonedChicken,
      price: { amount: 0 },
      reviewCount: 1,
      menuOptionGroups: [
        {
          id: `${startMenuId + 1}-g1`,
          groupName: '가격',
          maxSelectableCount: 1,
          absolutePrice: true,
          options: [
            {
              name: '미니 6조각',
              optionPrice: { amount: 10900 },
              isPopular: false,
            },
            {
              name: '중 10조각',
              optionPrice: { amount: 15900 },
              isPopular: true,
            },
          ],
        },
        {
          id: `${startMenuId + 1}-g2`,
          groupName: '맵기 선택',
          maxSelectableCount: 1,
          absolutePrice: false,
          options: [
            { name: '기본', optionPrice: { amount: 0 }, isPopular: false },
            { name: '매운맛', optionPrice: { amount: 500 }, isPopular: false },
          ],
        },
      ],
    },
    {
      id: startMenuId + 2,
      storeId,
      store: { id: storeId },
      menuName: '감자튀김',
      menuDescription: '바삭하게 튀긴 황금빛 감자튀김',
      thumbnailUrl: IMG.menuFries,
      price: { amount: 0 },
      reviewCount: 3,
      menuOptionGroups: [
        {
          id: `${startMenuId + 2}-g1`,
          groupName: '가격',
          maxSelectableCount: 1,
          absolutePrice: true,
          options: [
            { name: '보통', optionPrice: { amount: 4000 }, isPopular: true },
            { name: '대', optionPrice: { amount: 5500 }, isPopular: false },
          ],
        },
        {
          id: `${startMenuId + 2}-g2`,
          groupName: '음료 추가',
          maxSelectableCount: 3,
          absolutePrice: false,
          options: [
            {
              name: '코카콜라',
              optionPrice: { amount: 2000 },
              isPopular: true,
            },
            { name: '사이다', optionPrice: { amount: 2000 }, isPopular: false },
            { name: '맥주', optionPrice: { amount: 4000 }, isPopular: false },
          ],
        },
      ],
    },
    {
      id: startMenuId + 3,
      storeId,
      store: { id: storeId },
      menuName: '메인 메뉴 1',
      menuDescription: '메인 메뉴 1에 대한 설명이 어쩌고 저쩌고',
      thumbnailUrl: IMG.menuColeslaw,
      price: { amount: 0 },
      reviewCount: 22,
      menuOptionGroups: [
        {
          id: `${startMenuId + 3}-g1`,
          groupName: '가격',
          maxSelectableCount: 1,
          absolutePrice: true,
          options: [
            { name: '기본', optionPrice: { amount: 10000 }, isPopular: true },
            { name: '대', optionPrice: { amount: 13000 }, isPopular: false },
          ],
        },
        {
          id: `${startMenuId + 3}-g1b`,
          groupName: '맵기 선택',
          maxSelectableCount: 1,
          absolutePrice: false,
          options: [
            { name: '기본', optionPrice: { amount: 0 }, isPopular: false },
            { name: '매운맛', optionPrice: { amount: 500 }, isPopular: false },
          ],
        },
        {
          id: `${startMenuId + 3}-g2`,
          groupName: '음료 추가',
          maxSelectableCount: 3,
          absolutePrice: false,
          options: [
            {
              name: '코카콜라',
              optionPrice: { amount: 2000 },
              isPopular: true,
            },
            { name: '사이다', optionPrice: { amount: 2000 }, isPopular: false },
            { name: '맥주', optionPrice: { amount: 4000 }, isPopular: false },
          ],
        },
      ],
    },
    {
      id: startMenuId + 4,
      storeId,
      store: { id: storeId },
      menuName: '메인 메뉴 2',
      menuDescription: '메인 메뉴 2에 대한 설명이 어쩌고 저쩌고',
      thumbnailUrl: IMG.menuCheeseBall,
      price: { amount: 0 },
      reviewCount: 8,
      menuOptionGroups: [
        {
          id: `${startMenuId + 4}-g1`,
          groupName: '가격',
          maxSelectableCount: 1,
          absolutePrice: true,
          options: [
            { name: '기본', optionPrice: { amount: 12000 }, isPopular: true },
            { name: '대', optionPrice: { amount: 15000 }, isPopular: false },
          ],
        },
        {
          id: `${startMenuId + 4}-g1b`,
          groupName: '맵기 선택',
          maxSelectableCount: 1,
          absolutePrice: false,
          options: [
            { name: '기본', optionPrice: { amount: 0 }, isPopular: false },
            { name: '매운맛', optionPrice: { amount: 500 }, isPopular: false },
          ],
        },
        {
          id: `${startMenuId + 4}-g2`,
          groupName: '음료 추가',
          maxSelectableCount: 3,
          absolutePrice: false,
          options: [
            {
              name: '코카콜라',
              optionPrice: { amount: 2000 },
              isPopular: true,
            },
            { name: '사이다', optionPrice: { amount: 2000 }, isPopular: false },
            { name: '맥주', optionPrice: { amount: 4000 }, isPopular: false },
          ],
        },
      ],
    },
  ];
}

const EXTRA_MENUS = [
  {
    id: 901,
    menuName: '후라이드+감자튀김 세트',
    menuDescription: '후라이드 치킨과 감자튀김 세트',
    thumbnailUrl: IMG.menuFriedChicken,
    price: { amount: 0 },
    reviewCount: 15,
    rank: null,
    menuOptionGroups: [
      {
        id: '901-g1',
        groupName: '가격',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          { name: '기본', optionPrice: { amount: 21000 }, isPopular: true },
          { name: '대', optionPrice: { amount: 25000 }, isPopular: false },
        ],
      },
      {
        id: '901-g1b',
        groupName: '맵기 선택',
        maxSelectableCount: 1,
        absolutePrice: false,
        options: [
          { name: '기본', optionPrice: { amount: 0 }, isPopular: false },
          { name: '매운맛', optionPrice: { amount: 500 }, isPopular: false },
        ],
      },
      {
        id: '901-g2',
        groupName: '음료 추가',
        maxSelectableCount: 3,
        absolutePrice: false,
        options: [
          { name: '코카콜라', optionPrice: { amount: 2000 }, isPopular: true },
          { name: '사이다', optionPrice: { amount: 2000 }, isPopular: false },
        ],
      },
    ],
  },
  {
    id: 902,
    menuName: '양념+콜라 세트',
    menuDescription: '양념 치킨과 콜라 세트',
    thumbnailUrl: IMG.menuSeasonedChicken,
    price: { amount: 0 },
    reviewCount: 7,
    rank: null,
    menuOptionGroups: [
      {
        id: '902-g1',
        groupName: '가격',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          { name: '기본', optionPrice: { amount: 22000 }, isPopular: true },
          { name: '대', optionPrice: { amount: 26000 }, isPopular: false },
        ],
      },
      {
        id: '902-g1b',
        groupName: '맵기 선택',
        maxSelectableCount: 1,
        absolutePrice: false,
        options: [
          { name: '기본', optionPrice: { amount: 0 }, isPopular: false },
          { name: '매운맛', optionPrice: { amount: 500 }, isPopular: false },
        ],
      },
      {
        id: '902-g2',
        groupName: '음료 추가',
        maxSelectableCount: 3,
        absolutePrice: false,
        options: [
          { name: '코카콜라', optionPrice: { amount: 2000 }, isPopular: true },
          { name: '사이다', optionPrice: { amount: 2000 }, isPopular: false },
        ],
      },
    ],
  },
  {
    id: 911,
    menuName: '감자튀김',
    menuDescription: '바삭한 황금빛 감자튀김',
    thumbnailUrl: IMG.menuFries,
    price: { amount: 0 },
    reviewCount: 32,
    rank: null,
    menuOptionGroups: [
      {
        id: '911-g1',
        groupName: '가격',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          { name: '보통', optionPrice: { amount: 4000 }, isPopular: true },
          { name: '대', optionPrice: { amount: 5500 }, isPopular: false },
        ],
      },
      {
        id: '911-g2',
        groupName: '음료 추가',
        maxSelectableCount: 3,
        absolutePrice: false,
        options: [
          { name: '코카콜라', optionPrice: { amount: 2000 }, isPopular: true },
          { name: '사이다', optionPrice: { amount: 2000 }, isPopular: false },
        ],
      },
    ],
  },
  {
    id: 912,
    menuName: '코울슬로',
    menuDescription: '신선한 채소로 만든 코울슬로',
    thumbnailUrl: IMG.menuColeslaw,
    price: { amount: 0 },
    reviewCount: 12,
    rank: null,
    menuOptionGroups: [
      {
        id: '912-g1',
        groupName: '가격',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          { name: '기본', optionPrice: { amount: 3000 }, isPopular: true },
        ],
      },
      {
        id: '912-g2',
        groupName: '음료 추가',
        maxSelectableCount: 3,
        absolutePrice: false,
        options: [
          { name: '코카콜라', optionPrice: { amount: 2000 }, isPopular: true },
          { name: '사이다', optionPrice: { amount: 2000 }, isPopular: false },
        ],
      },
    ],
  },
  {
    id: 913,
    menuName: '치즈볼',
    menuDescription: '쫄깃한 치즈볼 5개',
    thumbnailUrl: IMG.menuCheeseBall,
    price: { amount: 0 },
    reviewCount: 45,
    rank: null,
    menuOptionGroups: [
      {
        id: '913-g1',
        groupName: '가격',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          { name: '기본', optionPrice: { amount: 3500 }, isPopular: true },
          { name: '10개', optionPrice: { amount: 6000 }, isPopular: false },
        ],
      },
      {
        id: '913-g2',
        groupName: '음료 추가',
        maxSelectableCount: 3,
        absolutePrice: false,
        options: [
          { name: '코카콜라', optionPrice: { amount: 2000 }, isPopular: true },
          { name: '사이다', optionPrice: { amount: 2000 }, isPopular: false },
        ],
      },
    ],
  },
  {
    id: 921,
    menuName: '콜라 500ml',
    menuDescription: '시원한 콜라',
    thumbnailUrl: IMG.menuCola,
    price: { amount: 2000 },
    reviewCount: 5,
    rank: null,
    menuOptionGroups: [
      {
        id: '921-g1',
        groupName: '가격',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          { name: '500ml', optionPrice: { amount: 2000 }, isPopular: true },
          { name: '1.5L', optionPrice: { amount: 3500 }, isPopular: false },
        ],
      },
    ],
  },
  {
    id: 922,
    menuName: '사이다 500ml',
    menuDescription: '청량한 사이다',
    thumbnailUrl: IMG.menuCola,
    price: { amount: 2000 },
    reviewCount: 3,
    rank: null,
    menuOptionGroups: [
      {
        id: '922-g1',
        groupName: '가격',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          { name: '500ml', optionPrice: { amount: 2000 }, isPopular: true },
          { name: '1.5L', optionPrice: { amount: 3500 }, isPopular: false },
        ],
      },
    ],
  },
  {
    id: 923,
    menuName: '맥주 500ml',
    menuDescription: '시원한 맥주',
    thumbnailUrl: IMG.menuBeer,
    price: { amount: 4000 },
    reviewCount: 18,
    rank: null,
    menuOptionGroups: [
      {
        id: '923-g1',
        groupName: '가격',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          { name: '500ml', optionPrice: { amount: 4000 }, isPopular: true },
          { name: '1L', optionPrice: { amount: 7000 }, isPopular: false },
        ],
      },
    ],
  },
];

const BAEKDABANG_MENUS_TEMPLATE = [
  {
    id: 201,
    menuName: '아메리카노',
    menuDescription: '빽다방의 기본 아메리카노. 진한 에스프레소와 물의 조화.',
    thumbnailUrl: IMG.menuAmericano,
    price: { amount: 0 },
    reviewCount: 1240,
    menuOptionGroups: [
      {
        id: '201-g1',
        groupName: '사이즈 선택',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          {
            name: 'ICE 기본 (473ml)',
            optionPrice: { amount: 1500 },
            isPopular: true,
          },
          {
            name: 'HOT 기본 (355ml)',
            optionPrice: { amount: 1500 },
            isPopular: false,
          },
          {
            name: 'ICE 빽사이즈 (887ml)',
            optionPrice: { amount: 2000 },
            isPopular: false,
          },
        ],
      },
      {
        id: '201-g2',
        groupName: '추가 옵션',
        maxSelectableCount: 3,
        absolutePrice: false,
        options: [
          {
            name: '에스프레소 샷 추가',
            optionPrice: { amount: 500 },
            isPopular: true,
          },
          {
            name: '바닐라 시럽 추가',
            optionPrice: { amount: 300 },
            isPopular: false,
          },
          {
            name: '헤이즐넛 시럽 추가',
            optionPrice: { amount: 300 },
            isPopular: false,
          },
        ],
      },
    ],
  },
  {
    id: 202,
    menuName: '원조커피',
    menuDescription:
      '빽다방 시그니처! 달달하고 진한 원조커피. 설탕이 들어간 달달한 커피.',
    thumbnailUrl: IMG.menuCreamCoffee,
    price: { amount: 0 },
    reviewCount: 2100,
    menuOptionGroups: [
      {
        id: '202-g1',
        groupName: '사이즈 선택',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          {
            name: 'ICE 기본 (473ml)',
            optionPrice: { amount: 1500 },
            isPopular: true,
          },
          {
            name: 'ICE 빽사이즈 (887ml)',
            optionPrice: { amount: 2000 },
            isPopular: false,
          },
        ],
      },
      {
        id: '202-g2',
        groupName: '추가 옵션',
        maxSelectableCount: 2,
        absolutePrice: false,
        options: [
          {
            name: '에스프레소 샷 추가',
            optionPrice: { amount: 500 },
            isPopular: false,
          },
          {
            name: '설탕 시럽 추가',
            optionPrice: { amount: 300 },
            isPopular: false,
          },
        ],
      },
    ],
  },
  {
    id: 203,
    menuName: '카페라떼',
    menuDescription: '부드러운 우유와 에스프레소의 조화.',
    thumbnailUrl: IMG.menuLatte,
    price: { amount: 0 },
    reviewCount: 890,
    menuOptionGroups: [
      {
        id: '203-g1',
        groupName: '사이즈 선택',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          {
            name: 'ICE 기본 (473ml)',
            optionPrice: { amount: 2000 },
            isPopular: true,
          },
          {
            name: 'HOT 기본 (355ml)',
            optionPrice: { amount: 2000 },
            isPopular: false,
          },
          {
            name: 'ICE 빽사이즈 (887ml)',
            optionPrice: { amount: 2500 },
            isPopular: false,
          },
        ],
      },
      {
        id: '203-g2',
        groupName: '추가 옵션',
        maxSelectableCount: 3,
        absolutePrice: false,
        options: [
          {
            name: '에스프레소 샷 추가',
            optionPrice: { amount: 500 },
            isPopular: false,
          },
          {
            name: '바닐라 시럽 추가',
            optionPrice: { amount: 300 },
            isPopular: true,
          },
        ],
      },
    ],
  },
  {
    id: 204,
    menuName: '바닐라라떼',
    menuDescription: '달콤한 바닐라 향이 가득한 라떼.',
    thumbnailUrl: IMG.menuVanillaLatte,
    price: { amount: 0 },
    reviewCount: 1050,
    menuOptionGroups: [
      {
        id: '204-g1',
        groupName: '사이즈 선택',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          {
            name: 'ICE 기본 (473ml)',
            optionPrice: { amount: 2500 },
            isPopular: true,
          },
          {
            name: 'HOT 기본 (355ml)',
            optionPrice: { amount: 2500 },
            isPopular: false,
          },
          {
            name: 'ICE 빽사이즈 (887ml)',
            optionPrice: { amount: 3000 },
            isPopular: false,
          },
        ],
      },
      {
        id: '204-g2',
        groupName: '추가 옵션',
        maxSelectableCount: 2,
        absolutePrice: false,
        options: [
          {
            name: '에스프레소 샷 추가',
            optionPrice: { amount: 500 },
            isPopular: false,
          },
        ],
      },
    ],
  },
  {
    id: 205,
    menuName: '크림커피',
    menuDescription: '달달한 원조커피 위에 크림을 얹은 빽다방 대표 메뉴.',
    thumbnailUrl: IMG.menuCreamCoffee,
    price: { amount: 0 },
    reviewCount: 1830,
    menuOptionGroups: [
      {
        id: '205-g1',
        groupName: '사이즈 선택',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          {
            name: 'ICE 기본 (473ml)',
            optionPrice: { amount: 2500 },
            isPopular: true,
          },
          {
            name: 'ICE 빽사이즈 (887ml)',
            optionPrice: { amount: 3000 },
            isPopular: false,
          },
        ],
      },
    ],
  },
  {
    id: 206,
    menuName: '빽스치노',
    menuDescription:
      '달콤 진한 커피에 크림과 초코 드리즐로 마무리한 시그니처 음료.',
    thumbnailUrl: IMG.menuLatte,
    price: { amount: 0 },
    reviewCount: 740,
    menuOptionGroups: [
      {
        id: '206-g1',
        groupName: '사이즈 선택',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          {
            name: 'ICE 기본 (473ml)',
            optionPrice: { amount: 3000 },
            isPopular: true,
          },
          {
            name: 'ICE 빽사이즈 (887ml)',
            optionPrice: { amount: 3500 },
            isPopular: false,
          },
        ],
      },
    ],
  },
  {
    id: 207,
    menuName: '딸기라떼',
    menuDescription: '새콤달콤 딸기와 우유의 조화, 빽다방 딸기라떼.',
    thumbnailUrl: IMG.menuStrawberryLatte,
    price: { amount: 0 },
    reviewCount: 560,
    menuOptionGroups: [
      {
        id: '207-g1',
        groupName: '사이즈 선택',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          {
            name: 'ICE 기본 (473ml)',
            optionPrice: { amount: 3000 },
            isPopular: true,
          },
          {
            name: 'ICE 빽사이즈 (887ml)',
            optionPrice: { amount: 3500 },
            isPopular: false,
          },
        ],
      },
    ],
  },
  {
    id: 208,
    menuName: '딸기에이드',
    menuDescription: '상큼한 딸기와 탄산의 조화.',
    thumbnailUrl: IMG.menuAde,
    price: { amount: 0 },
    reviewCount: 320,
    menuOptionGroups: [
      {
        id: '208-g1',
        groupName: '사이즈 선택',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          {
            name: 'ICE 기본 (473ml)',
            optionPrice: { amount: 2500 },
            isPopular: true,
          },
          {
            name: 'ICE 빽사이즈 (887ml)',
            optionPrice: { amount: 3000 },
            isPopular: false,
          },
        ],
      },
    ],
  },
  {
    id: 209,
    menuName: '청포도에이드',
    menuDescription: '달콤 상큼한 청포도 에이드.',
    thumbnailUrl: IMG.menuAde,
    price: { amount: 0 },
    reviewCount: 210,
    menuOptionGroups: [
      {
        id: '209-g1',
        groupName: '사이즈 선택',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          {
            name: 'ICE 기본 (473ml)',
            optionPrice: { amount: 2500 },
            isPopular: true,
          },
          {
            name: 'ICE 빽사이즈 (887ml)',
            optionPrice: { amount: 3000 },
            isPopular: false,
          },
        ],
      },
    ],
  },
  {
    id: 210,
    menuName: '복숭아아이스티',
    menuDescription: '시원하고 달콤한 복숭아 아이스티.',
    thumbnailUrl: IMG.menuIcedTea,
    price: { amount: 0 },
    reviewCount: 180,
    menuOptionGroups: [
      {
        id: '210-g1',
        groupName: '사이즈 선택',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          {
            name: 'ICE 기본 (473ml)',
            optionPrice: { amount: 2000 },
            isPopular: true,
          },
          {
            name: 'ICE 빽사이즈 (887ml)',
            optionPrice: { amount: 2500 },
            isPopular: false,
          },
        ],
      },
    ],
  },
];

const SHANGTZ_MENUS_TEMPLATE = [
  {
    id: 301,
    menuName: 'Self 마라탕 1인분',
    menuDescription:
      '직접 재료를 담아 끓여드리는 셀프 마라탕 1인분. 기본 채소+육류 재료 포함.',
    thumbnailUrl: IMG.menuMaratang,
    price: { amount: 0 },
    reviewCount: 4200,
    menuOptionGroups: [
      {
        id: '301-g1',
        groupName: '맵기 선택',
        maxSelectableCount: 1,
        absolutePrice: false,
        options: [
          { name: '순한맛', optionPrice: { amount: 0 }, isPopular: false },
          { name: '보통', optionPrice: { amount: 0 }, isPopular: true },
          { name: '중간매운맛', optionPrice: { amount: 0 }, isPopular: false },
          { name: '매운맛', optionPrice: { amount: 0 }, isPopular: false },
          { name: '아주매운맛', optionPrice: { amount: 0 }, isPopular: false },
        ],
      },
      {
        id: '301-g2',
        groupName: '가격',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          {
            name: '기본 1인분',
            optionPrice: { amount: 9800 },
            isPopular: true,
          },
          {
            name: '프리미엄 1인분 (재료 업그레이드)',
            optionPrice: { amount: 12800 },
            isPopular: false,
          },
        ],
      },
      {
        id: '301-g3',
        groupName: '면 추가 (선택)',
        maxSelectableCount: 2,
        absolutePrice: false,
        options: [
          { name: '당면 추가', optionPrice: { amount: 1000 }, isPopular: true },
          {
            name: '우동면 추가',
            optionPrice: { amount: 1000 },
            isPopular: false,
          },
          {
            name: '라면사리 추가',
            optionPrice: { amount: 1000 },
            isPopular: false,
          },
          {
            name: '쌀국수면 추가',
            optionPrice: { amount: 1000 },
            isPopular: false,
          },
        ],
      },
    ],
  },
  {
    id: 302,
    menuName: '2~3인분 마라탕 세트',
    menuDescription:
      '두 명 이상이 함께 즐기는 마라탕 세트. 푸짐한 재료와 함께.',
    thumbnailUrl: IMG.menuMaratang,
    price: { amount: 0 },
    reviewCount: 1800,
    menuOptionGroups: [
      {
        id: '302-g1',
        groupName: '맵기 선택',
        maxSelectableCount: 1,
        absolutePrice: false,
        options: [
          { name: '순한맛', optionPrice: { amount: 0 }, isPopular: false },
          { name: '보통', optionPrice: { amount: 0 }, isPopular: true },
          { name: '중간매운맛', optionPrice: { amount: 0 }, isPopular: false },
          { name: '매운맛', optionPrice: { amount: 0 }, isPopular: false },
          { name: '아주매운맛', optionPrice: { amount: 0 }, isPopular: false },
        ],
      },
      {
        id: '302-g2',
        groupName: '인원 선택',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          { name: '2인분', optionPrice: { amount: 19600 }, isPopular: true },
          { name: '3인분', optionPrice: { amount: 28000 }, isPopular: false },
        ],
      },
      {
        id: '302-g3',
        groupName: '면 추가 (선택)',
        maxSelectableCount: 3,
        absolutePrice: false,
        options: [
          { name: '당면 추가', optionPrice: { amount: 1000 }, isPopular: true },
          {
            name: '우동면 추가',
            optionPrice: { amount: 1000 },
            isPopular: false,
          },
          {
            name: '라면사리 추가',
            optionPrice: { amount: 1000 },
            isPopular: false,
          },
        ],
      },
    ],
  },
  {
    id: 303,
    menuName: '마라샹궈 1인분',
    menuDescription:
      '볶음식 마라 요리. 강한 마라향이 재료에 깊게 배어 있는 볶음 요리.',
    thumbnailUrl: IMG.menuXiaochao,
    price: { amount: 0 },
    reviewCount: 3100,
    menuOptionGroups: [
      {
        id: '303-g1',
        groupName: '맵기 선택',
        maxSelectableCount: 1,
        absolutePrice: false,
        options: [
          { name: '순한맛', optionPrice: { amount: 0 }, isPopular: false },
          { name: '보통', optionPrice: { amount: 0 }, isPopular: true },
          { name: '중간매운맛', optionPrice: { amount: 0 }, isPopular: false },
          { name: '매운맛', optionPrice: { amount: 0 }, isPopular: false },
          { name: '아주매운맛', optionPrice: { amount: 0 }, isPopular: false },
        ],
      },
      {
        id: '303-g2',
        groupName: '가격',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          {
            name: '기본 1인분',
            optionPrice: { amount: 12900 },
            isPopular: true,
          },
          {
            name: '프리미엄 1인분',
            optionPrice: { amount: 15900 },
            isPopular: false,
          },
        ],
      },
      {
        id: '303-g3',
        groupName: '면 추가 (선택)',
        maxSelectableCount: 2,
        absolutePrice: false,
        options: [
          { name: '당면 추가', optionPrice: { amount: 1000 }, isPopular: true },
          {
            name: '우동면 추가',
            optionPrice: { amount: 1000 },
            isPopular: false,
          },
          {
            name: '볶음면으로 변경',
            optionPrice: { amount: 1500 },
            isPopular: false,
          },
        ],
      },
    ],
  },
  {
    id: 304,
    menuName: '마라샹궈 2인분',
    menuDescription: '두 명이 함께 즐기는 마라샹궈. 푸짐한 양과 진한 마라향.',
    thumbnailUrl: IMG.menuXiaochao,
    price: { amount: 0 },
    reviewCount: 980,
    menuOptionGroups: [
      {
        id: '304-g1',
        groupName: '맵기 선택',
        maxSelectableCount: 1,
        absolutePrice: false,
        options: [
          { name: '순한맛', optionPrice: { amount: 0 }, isPopular: false },
          { name: '보통', optionPrice: { amount: 0 }, isPopular: true },
          { name: '중간매운맛', optionPrice: { amount: 0 }, isPopular: false },
          { name: '매운맛', optionPrice: { amount: 0 }, isPopular: false },
          { name: '아주매운맛', optionPrice: { amount: 0 }, isPopular: false },
        ],
      },
      {
        id: '304-g2',
        groupName: '가격',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          {
            name: '기본 2인분',
            optionPrice: { amount: 24900 },
            isPopular: true,
          },
          {
            name: '프리미엄 2인분',
            optionPrice: { amount: 29900 },
            isPopular: false,
          },
        ],
      },
    ],
  },
  {
    id: 305,
    menuName: '마라 로제 샹궈',
    menuDescription:
      '마라 특유의 얼얼함에 부드러운 로제 크림소스를 더한 퓨전 샹궈.',
    thumbnailUrl: IMG.menuXiaochao,
    price: { amount: 0 },
    reviewCount: 2400,
    menuOptionGroups: [
      {
        id: '305-g1',
        groupName: '맵기 선택',
        maxSelectableCount: 1,
        absolutePrice: false,
        options: [
          { name: '순한맛', optionPrice: { amount: 0 }, isPopular: true },
          { name: '보통', optionPrice: { amount: 0 }, isPopular: false },
          { name: '매운맛', optionPrice: { amount: 0 }, isPopular: false },
        ],
      },
      {
        id: '305-g2',
        groupName: '인원 선택',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          { name: '1인분', optionPrice: { amount: 13900 }, isPopular: true },
          { name: '2인분', optionPrice: { amount: 25900 }, isPopular: false },
        ],
      },
    ],
  },
  {
    id: 306,
    menuName: '꿔바로우 미니',
    menuDescription: '바삭한 튀김옷에 새콤달콤 소스를 곁들인 꿔바로우 소자.',
    thumbnailUrl: IMG.menuGwobaorou,
    price: { amount: 0 },
    reviewCount: 5600,
    menuOptionGroups: [
      {
        id: '306-g1',
        groupName: '가격',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          {
            name: '미니 (200g)',
            optionPrice: { amount: 8900 },
            isPopular: true,
          },
        ],
      },
      {
        id: '306-g2',
        groupName: '소스 선택',
        maxSelectableCount: 1,
        absolutePrice: false,
        options: [
          {
            name: '기본 새콤달콤 소스',
            optionPrice: { amount: 0 },
            isPopular: true,
          },
          { name: '마라 소스', optionPrice: { amount: 500 }, isPopular: false },
        ],
      },
    ],
  },
  {
    id: 307,
    menuName: '꿔바로우',
    menuDescription: '바삭한 튀김옷에 새콤달콤 소스를 곁들인 꿔바로우 정자.',
    thumbnailUrl: IMG.menuGwobaorou,
    price: { amount: 0 },
    reviewCount: 3200,
    menuOptionGroups: [
      {
        id: '307-g1',
        groupName: '가격',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          {
            name: '정 (350g)',
            optionPrice: { amount: 12900 },
            isPopular: true,
          },
          {
            name: '대 (500g)',
            optionPrice: { amount: 16900 },
            isPopular: false,
          },
        ],
      },
      {
        id: '307-g2',
        groupName: '소스 선택',
        maxSelectableCount: 1,
        absolutePrice: false,
        options: [
          {
            name: '기본 새콤달콤 소스',
            optionPrice: { amount: 0 },
            isPopular: true,
          },
          { name: '마라 소스', optionPrice: { amount: 500 }, isPopular: false },
        ],
      },
    ],
  },
  {
    id: 308,
    menuName: '온면',
    menuDescription:
      '따뜻한 마라 국물에 담긴 온면. 마라탕과 함께 즐기기 좋은 사이드.',
    thumbnailUrl: IMG.menuNoodle,
    price: { amount: 0 },
    reviewCount: 870,
    menuOptionGroups: [
      {
        id: '308-g1',
        groupName: '맵기 선택',
        maxSelectableCount: 1,
        absolutePrice: false,
        options: [
          { name: '순한맛', optionPrice: { amount: 0 }, isPopular: false },
          { name: '보통', optionPrice: { amount: 0 }, isPopular: true },
          { name: '매운맛', optionPrice: { amount: 0 }, isPopular: false },
        ],
      },
      {
        id: '308-g2',
        groupName: '가격',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          { name: '기본', optionPrice: { amount: 6900 }, isPopular: true },
        ],
      },
    ],
  },
  {
    id: 309,
    menuName: '볶음면',
    menuDescription: '마라 소스로 볶아낸 탱탱한 볶음면.',
    thumbnailUrl: IMG.menuNoodle,
    price: { amount: 0 },
    reviewCount: 540,
    menuOptionGroups: [
      {
        id: '309-g1',
        groupName: '맵기 선택',
        maxSelectableCount: 1,
        absolutePrice: false,
        options: [
          { name: '순한맛', optionPrice: { amount: 0 }, isPopular: false },
          { name: '보통', optionPrice: { amount: 0 }, isPopular: true },
          { name: '매운맛', optionPrice: { amount: 0 }, isPopular: false },
        ],
      },
      {
        id: '309-g2',
        groupName: '가격',
        maxSelectableCount: 1,
        absolutePrice: true,
        options: [
          { name: '기본', optionPrice: { amount: 7900 }, isPopular: true },
        ],
      },
    ],
  },
  {
    id: 310,
    menuName: '계란볶음밥',
    menuDescription: '고슬고슬하게 볶아낸 중식 계란볶음밥.',
    thumbnailUrl: IMG.menuFriedRice,
    price: { amount: 4900 },
    reviewCount: 310,
    menuOptionGroups: [],
  },
  {
    id: 311,
    menuName: '고수 군만두 (8개)',
    menuDescription:
      '고소하고 바삭한 군만두. 고수 향이 살짝 가미된 중식 스타일.',
    thumbnailUrl: IMG.menuDumpling,
    price: { amount: 5900 },
    reviewCount: 420,
    menuOptionGroups: [],
  },
];

const CUSTOM_STORE_MENUS_MAP = {
  'bb000002-0000-4000-8000-000000000002': BAEKDABANG_MENUS_TEMPLATE,
  'aa000001-0000-4000-8000-000000000001': SHANGTZ_MENUS_TEMPLATE,
};

function buildMenuGroupsFromMenus(menus, { includeExtraGroups = true } = {}) {
  const popularMenus = menus.slice(0, 3).map((m, i) => ({ ...m, rank: i + 1 }));
  const mainMenus = menus.map((m) => ({ ...m, rank: null }));
  const baseGroups = [
    {
      id: 'popular',
      groupTabName: '인기메뉴',
      groupName: '가장 인기 있는 메뉴',
      groupDescription: '한 달간 주문수가 많고 만족도가 가장 높은 메뉴',
      menus: popularMenus,
    },
    {
      id: 'main',
      groupTabName: '메인메뉴',
      groupName: '메인 메뉴',
      groupDescription:
        '메뉴 그룹의 설명이 여기에 나옵니다 이렇게 저렇게 어쩌고 저쩌고',
      menus: mainMenus,
    },
  ];
  if (!includeExtraGroups) return baseGroups;
  return [
    ...baseGroups,
    {
      id: 'set',
      groupTabName: '세트메뉴',
      groupName: '세트 메뉴',
      groupDescription: '메인 메뉴와 사이드를 함께 즐기세요',
      menus: EXTRA_MENUS.filter((m) => [901, 902].includes(m.id)),
    },
    {
      id: 'side',
      groupTabName: '사이드 메뉴',
      groupName: '사이드 메뉴',
      groupDescription: '메인 메뉴와 함께 곁들이기 좋은 사이드',
      menus: EXTRA_MENUS.filter((m) => [911, 912, 913].includes(m.id)),
    },
    {
      id: 'drink',
      groupTabName: '음료',
      groupName: '음료',
      groupDescription: '치킨과 함께하는 음료',
      menus: EXTRA_MENUS.filter((m) => [921, 922, 923].includes(m.id)),
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
  const hasCustomMenus = Array.isArray(menus);
  const resolvedMenus = hasCustomMenus ? menus : buildDefaultMenus(id, 1);
  const allMenus = hasCustomMenus
    ? resolvedMenus
    : [...resolvedMenus, ...EXTRA_MENUS];
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
    menus: allMenus,
    menuGroups: buildMenuGroupsFromMenus(resolvedMenus, {
      includeExtraGroups: !hasCustomMenus,
    }),
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
  storePublicId,
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
    storePublicId: storePublicId ?? null,
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

const searchResultSeedStores = SEARCH_RESULT_STORES.map((s, i) => {
  const storeId = 2 + i;
  const customMenuTemplate = CUSTOM_STORE_MENUS_MAP[s.storePublicId];
  const customMenus = customMenuTemplate?.map((m) => ({
    ...m,
    storeId,
    store: { id: storeId },
  }));
  const store = buildStore({
    id: storeId,
    storePublicId: s.storePublicId,
    storeName: s.storeName,
    storeCategory: s.storeCategory,
    thumbnailUrl: s.thumbnailUrl,
    minimumOrderAmount: s.minimumOrderAmount,
    deliveryFee: s.deliveryFee,
    menus: customMenus,
  });
  store.totalRating = s.totalRating;
  store.reviewCount = s.reviewCount;
  store.deliveryTimeMin = s.deliveryTimeMin;
  return store;
});

const MOCK_PAYMENTS_KEY = 'mock-payments';
const MOCK_REVIEWS_KEY = 'mock-reviews';

function loadPayments() {
  try {
    const raw = localStorage.getItem(MOCK_PAYMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePayments() {
  try {
    localStorage.setItem(MOCK_PAYMENTS_KEY, JSON.stringify(mockState.payments));
  } catch {
    // ignore
  }
}

function loadReviews() {
  try {
    const raw = localStorage.getItem(MOCK_REVIEWS_KEY);
    return raw ? JSON.parse(raw) : { myReviews: [], storeReviews: {} };
  } catch {
    return { myReviews: [], storeReviews: {} };
  }
}

function saveReviews() {
  try {
    localStorage.setItem(
      MOCK_REVIEWS_KEY,
      JSON.stringify({
        myReviews: mockState.myReviews,
        storeReviews: mockState.storeReviewsByStoreId,
      })
    );
  } catch {
    // ignore
  }
}

const mockState = {
  currentUser: null,
  nextStoreId: 2 + SEARCH_RESULT_STORES.length,
  nextMenuId: 100,
  nextOrderId: 5000,
  nextPaymentId: 7000,
  stores: [seedStore, ...searchResultSeedStores],
  storeReviewsByStoreId: (() => {
    const saved = loadReviews();
    const base = {
      ...Object.fromEntries(
        [
          DEFAULT_STORE_PUBLIC_ID,
          ...SEARCH_RESULT_STORES.map((s) => s.storePublicId),
        ].map((id) => [id, []])
      ),
    };
    return { ...base, ...saved.storeReviews };
  })(),
  myReviews: loadReviews().myReviews,
  userAddresses: [
    {
      alias: '집',
      roadAddress: '서울특별시 관악구 관악로 1',
      jibunAddress: '서울특별시 관악구 봉천동 1',
      detailAddress: '101동 101호',
      isDefault: true,
    },
  ],
  recentKeywords: ['처갓집양념치킨', '메가커피', '춘', '마라탕', '치킨'],
  deliveryLocations: {},
  payments: loadPayments(),
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

  if (reviewCount > 0) {
    targetStore.reviewCount = reviewCount;
    targetStore.totalRating = Number((totalRating / reviewCount).toFixed(1));
  }
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
  mockState.currentUser = {
    userId: MOCK_USER_ID,
    email: payload?.email ?? 'mock-user@baedariyo.com',
    name: payload?.name ?? '',
    nickname: payload?.nickname ?? 'mock-user',
    phoneNumber: payload?.phoneNumber ?? '',
  };
  return clone(mockState.currentUser);
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
  const saved = mockState.currentUser;
  return clone({
    accessToken: createToken('mock-user-access'),
    refreshToken: createToken('mock-user-refresh'),
    userId: MOCK_USER_ID,
    email: payload?.email ?? saved?.email ?? 'mock-user@baedariyo.com',
    name: saved?.name ?? '',
    nickname: saved?.nickname ?? '',
    phoneNumber: saved?.phoneNumber ?? '',
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
  saveReviews();

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

  saveReviews();
  return clone({ deleted: true, publicStoreReviewId });
}

function createOrder(payload) {
  const orderId = mockState.nextOrderId;
  const paymentId = mockState.nextPaymentId;
  mockState.nextOrderId += 1;
  mockState.nextPaymentId += 1;

  const storeId = toPositiveInteger(payload?.storeId) ?? 1;
  const storeName =
    payload?.storeName?.trim() || resolveStoreNameById(storeId, 'Mock 치킨집');
  const storePublicId = payload?.storePublicId ?? null;
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
    storePublicId,
    paymentStatus: 'READY',
    amount,
    paymentKey: `mock_order_payment_${paymentId}`,
    createdAt: nowIso(),
    orderMenus,
    storeImages: [`https://picsum.photos/seed/order-store-${storeId}/800/500`],
  });

  mockState.payments.unshift(payment);
  savePayments();

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
  savePayments();
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

function deleteMyPayment(paymentId) {
  const idx = mockState.payments.findIndex((p) => p.paymentId === paymentId);
  if (idx !== -1) mockState.payments.splice(idx, 1);
  savePayments();
  return clone({ deleted: true, paymentId });
}

function changeUserPassword() {
  return clone(null);
}

function changeRiderPassword() {
  return clone(null);
}

function checkUserEmailDuplicate() {
  return false;
}

function checkRiderEmailDuplicate() {
  return false;
}

function updateUserNickname() {
  return clone(null);
}

function updateUserPhoneNumber() {
  return clone(null);
}

function getUserAddresses() {
  return clone(mockState.userAddresses);
}

function addUserAddress(payload) {
  const newAddress = {
    alias: payload?.alias ?? '기타',
    roadAddress: payload?.roadAddress ?? '',
    jibunAddress: payload?.jibunAddress ?? '',
    detailAddress: payload?.detailAddress ?? '',
    isDefault: payload?.isDefault ?? false,
  };

  if (newAddress.isDefault) {
    for (const addr of mockState.userAddresses) {
      addr.isDefault = false;
    }
  }

  mockState.userAddresses.push(newAddress);
  return clone(null);
}

function deleteUserAddress(payload) {
  mockState.userAddresses = mockState.userAddresses.filter(
    (addr) => addr.alias !== payload?.addressAlias
  );
  return clone(null);
}

function setDefaultAddress(payload) {
  for (const addr of mockState.userAddresses) {
    addr.isDefault = addr.alias === payload?.addressAlias;
  }
  return clone(null);
}

function updateAddressAlias(payload) {
  const target = mockState.userAddresses.find(
    (addr) => addr.alias === payload?.addressAlias
  );
  if (target) {
    target.alias = payload?.newAddressAlias ?? target.alias;
  }
  return clone(null);
}

function updateRiderNickname() {
  return clone(null);
}

function updateRiderPhoneNumber() {
  return clone(null);
}

function updateRiderVehicle() {
  return clone(null);
}

function setRiderOnline() {
  return clone(null);
}

function setRiderOffline() {
  return clone(null);
}

function startRiderDelivery() {
  return clone(null);
}

function completeRiderDelivery() {
  return clone(null);
}

function assignRiderToDelivery(orderId) {
  return clone({ orderId, riderId: MOCK_RIDER_ID, assigned: true });
}

function startDelivery(orderId) {
  return clone({ orderId, started: true });
}

function completeDelivery(orderId) {
  return clone({ orderId, completed: true });
}

function getDeliveryLocation(orderId) {
  return clone(
    mockState.deliveryLocations[orderId] ?? {
      latitude: 37.5665,
      longitude: 126.978,
    }
  );
}

function updateDeliveryLocation(orderId, payload) {
  mockState.deliveryLocations[orderId] = {
    latitude: payload?.latitude ?? 37.5665,
    longitude: payload?.longitude ?? 126.978,
  };
  return clone(null);
}

const POPULAR_KEYWORDS = [
  '두바이쫀득쿠키',
  '치킨',
  '피자',
  '요거트아이스크림',
  '국밥',
  '닭강정',
  '육회',
  '마라탕',
  '카페',
  '떡볶이',
];

function getAutocompleteSuggestions(keyword) {
  if (!keyword) return clone({ keywords: [] });
  const q = keyword.toLowerCase();
  const matched = POPULAR_KEYWORDS.filter((k) => k.toLowerCase().includes(q));
  return clone({ keywords: matched });
}

function getPopularKeywords() {
  return clone({ keywords: POPULAR_KEYWORDS });
}

function getRecentKeywords() {
  return clone({ keywords: mockState.recentKeywords });
}

function deleteRecentKeyword(keyword) {
  mockState.recentKeywords = mockState.recentKeywords.filter(
    (k) => k !== keyword
  );
  return clone(null);
}

function deleteAllRecentKeywords() {
  mockState.recentKeywords = [];
  return clone(null);
}

function getUserProfile() {
  const saved = mockState.currentUser;
  return clone({
    name: saved?.name ?? '홍길동',
    nickname: saved?.nickname ?? '망고가 말랑',
    email: saved?.email ?? 'email@email.com',
    phoneNumber: saved?.phoneNumber ?? '010-6659-5866',
  });
}

function getPaymentMethods() {
  return clone(mockState.paymentMethods ?? []);
}

function addPaymentMethod(payload) {
  const method = {
    id: `pm-${Date.now()}`,
    cardName: payload?.cardName ?? '새 카드',
    cardNumber: payload?.cardNumber ?? '0000-0000-0000-0000',
    isDefault: (mockState.paymentMethods ?? []).length === 0,
  };
  mockState.paymentMethods = mockState.paymentMethods ?? [];
  mockState.paymentMethods.push(method);
  return clone(method);
}

function deletePaymentMethod(paymentMethodId) {
  mockState.paymentMethods = (mockState.paymentMethods ?? []).filter(
    (m) => m.id !== paymentMethodId
  );
  return clone({ deleted: true });
}

function getRiderDeliveryHistory() {
  const now = new Date();
  const today = (h, m) => {
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };
  const yesterday = (h, m) => {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  return clone([
    {
      orderId: 101,
      storeName: '맥도날드 강남점',
      customerAddress: '서울 강남구 역삼동',
      deliveryFee: 4500,
      deliveryStartedAt: today(18, 20),
      deliveryCompleteAt: today(18, 42),
    },
    {
      orderId: 100,
      storeName: '버거킹 선릉점',
      customerAddress: '서울 강남구 대치동',
      deliveryFee: 5000,
      deliveryStartedAt: today(16, 55),
      deliveryCompleteAt: today(17, 17),
    },
    {
      orderId: 99,
      storeName: 'BBQ 삼성점',
      customerAddress: '서울 강남구 삼성동',
      deliveryFee: 4000,
      deliveryStartedAt: today(15, 45),
      deliveryCompleteAt: today(16, 3),
    },
    {
      orderId: 95,
      storeName: '피자헛 역삼점',
      customerAddress: '서울 강남구 역삼동',
      deliveryFee: 5500,
      deliveryStartedAt: yesterday(19, 50),
      deliveryCompleteAt: yesterday(20, 12),
    },
    {
      orderId: 94,
      storeName: '도미노피자 대치점',
      customerAddress: '서울 강남구 도곡동',
      deliveryFee: 4500,
      deliveryStartedAt: yesterday(18, 10),
      deliveryCompleteAt: yesterday(18, 30),
    },
    {
      orderId: 93,
      storeName: '교촌치킨 삼성점',
      customerAddress: '서울 강남구 청담동',
      deliveryFee: 5000,
      deliveryStartedAt: yesterday(16, 45),
      deliveryCompleteAt: yesterday(17, 5),
    },
  ]);
}

export const mockApi = {
  signupUser,
  signupRider,
  loginUser,
  loginRider,
  withdrawUser,
  withdrawRider,
  changeUserPassword,
  changeRiderPassword,
  checkUserEmailDuplicate,
  checkRiderEmailDuplicate,
  updateUserNickname,
  updateUserPhoneNumber,
  getUserAddresses,
  addUserAddress,
  deleteUserAddress,
  setDefaultAddress,
  updateAddressAlias,
  updateRiderNickname,
  updateRiderPhoneNumber,
  updateRiderVehicle,
  setRiderOnline,
  setRiderOffline,
  startRiderDelivery,
  completeRiderDelivery,
  assignRiderToDelivery,
  startDelivery,
  completeDelivery,
  getDeliveryLocation,
  updateDeliveryLocation,
  getAutocompleteSuggestions,
  getPopularKeywords,
  getRecentKeywords,
  deleteRecentKeyword,
  deleteAllRecentKeywords,
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
  deleteMyPayment,
  searchStores,
  getSearchHistory,
  getUserProfile,
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  getRiderDeliveryHistory,
};
