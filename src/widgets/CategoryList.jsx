import { Link } from 'react-router-dom';

import { CATEGORIES } from '@/shared/lib/categories';

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
