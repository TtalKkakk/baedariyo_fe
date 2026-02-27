import { Link } from 'react-router-dom';

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

const CATEGORIES = [
  { id: 'cafe_dessert', label: '카페·디저트', icon: cafeDessertIcon },
  { id: 'western', label: '양식', icon: westernIcon },
  { id: 'chinese', label: '중식', icon: chineseIcon },
  { id: 'korean', label: '한식', icon: koreanIcon },
  { id: 'japanese', label: '일식', icon: japaneseIcon },
  { id: 'bunsik', label: '분식', icon: bunsikIcon },
  { id: 'fastfood', label: '패스트 푸드', icon: fastfoodIcon },
  { id: 'chicken', label: '치킨', icon: chickenIcon },
  { id: 'meat', label: '고기·돈까스', icon: meatIcon },
  { id: 'sushi', label: '회', icon: sushiIcon },
];

export default function CategoryList() {
  return (
    <div className="grid grid-cols-5 gap-[8px]">
      {CATEGORIES.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className="flex flex-col items-center gap-1.5"
        >
          <img src={category.icon} alt={category.label} className="w-16 h-16" />
          <span className="text-body3 font-medium text-center text-[var(--color-semantic-label-normal)] whitespace-nowrap">
            {category.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
