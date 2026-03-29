import bunsikIcon from '@/shared/assets/icons/category/bunsik.png';
import cafeDessertIcon from '@/shared/assets/icons/category/cafe_dessert.png';
import chickenIcon from '@/shared/assets/icons/category/chicken.png';
import chineseIcon from '@/shared/assets/icons/category/chinese.png';
import fastfoodIcon from '@/shared/assets/icons/category/fastfood.png';
import japaneseIcon from '@/shared/assets/icons/category/japanese.png';
import koreanIcon from '@/shared/assets/icons/category/korean.png';
import meatIcon from '@/shared/assets/icons/category/meat.png';
import sushiIcon from '@/shared/assets/icons/category/sushi.png';
import westernIcon from '@/shared/assets/icons/category/western.png';

export const CATEGORIES = [
  {
    id: 'cafe_dessert',
    label: '카페·디저트',
    apiValue: 'CAFE_DESSERT',
    icon: cafeDessertIcon,
  },
  { id: 'western', label: '양식', apiValue: 'WESTERN', icon: westernIcon },
  { id: 'chinese', label: '중식', apiValue: 'CHINESE', icon: chineseIcon },
  { id: 'korean', label: '한식', apiValue: 'KOREAN', icon: koreanIcon },
  { id: 'japanese', label: '일식', apiValue: 'JAPANESE', icon: japaneseIcon },
  { id: 'bunsik', label: '분식', apiValue: 'SNACK', icon: bunsikIcon },
  {
    id: 'fastfood',
    label: '패스트 푸드',
    apiValue: 'FAST_FOOD',
    icon: fastfoodIcon,
  },
  { id: 'chicken', label: '치킨', apiValue: 'CHICKEN', icon: chickenIcon },
  { id: 'meat', label: '고기·돈까스', apiValue: 'MEAT', icon: meatIcon },
  { id: 'sushi', label: '회', apiValue: 'PORK_FISH', icon: sushiIcon },
];
