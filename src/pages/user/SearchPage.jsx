import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchIcon from '@/shared/assets/icons/header/search.svg?react';
import BackIcon from '@/shared/assets/icons/header/back.svg?react';
import DeleteIcon from '@/shared/assets/icons/header/delete.svg?react';
import { CategoryList } from '@/widgets';

const INITIAL_RECENT = ['처갓집양념치킨', '메가커피', '춘'];

const RECOMMENDED = [
  '두쫀쿠',
  '마라상귀',
  '삼첩분식',
  '족발',
  '와플대학',
  '후라이드 참 잘하는 집',
  '역전할머니맥주',
];

const POPULAR = [
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

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const removeRecent = (keyword) => {
    setRecentSearches((prev) => prev.filter((k) => k !== keyword));
  };

  const left = POPULAR.slice(0, 5);
  const right = POPULAR.slice(5, 10);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 검색 헤더 */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white">
        <button onClick={() => navigate(-1)} className="shrink-0">
          <BackIcon className="size-5" />
        </button>
        <div
          className={`w-72 h-10 flex items-center gap-3 pr-3 bg-[var(--color-semantic-background-normal-normal)] border rounded-lg ${isFocused ? 'pl-3 border-[var(--color-atomic-redOrange-90)]' : 'pl-2 border-[var(--color-semantic-line-normal-normal)]'}`}
        >
          {!isFocused && (
            <SearchIcon className="size-6 shrink-0 [&_path]:fill-[var(--color-atomic-redOrange-80)]" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="퇴근 하고 나서 치킨에 맥주?"
            className="flex-1 bg-transparent py-2.5 text-body1 font-normal text-[var(--color-semantic-label-alternative)] placeholder:text-[var(--color-semantic-label-alternative)] outline-none"
          />
        </div>
      </div>

      {/* 스크롤 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* 최근 검색어 */}
        {recentSearches.length > 0 && (
          <div className="pb-8">
            <p className="text-lg font-medium text-[var(--color-semantic-label-normal)] mb-2">
              최근 검색어
            </p>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
              {recentSearches.map((keyword) => (
                <span
                  key={keyword}
                  className="flex items-center gap-0.5 px-2.5 py-1 bg-[var(--color-atomic-coolNeutral-98)] rounded-full text-body2 font-medium text-[var(--color-semantic-label-normal)]"
                >
                  {keyword}
                  <button onClick={() => removeRecent(keyword)}>
                    <DeleteIcon className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 추천 검색어 */}
        <div className="pb-8">
          <p className="text-lg font-medium text-[var(--color-semantic-label-normal)] mb-2">
            추천 검색어
          </p>
          <div className="flex flex-wrap gap-1.5">
            {RECOMMENDED.map((keyword) => (
              <button
                key={keyword}
                className="h-7 px-2.5 py-1 border border-[var(--color-atomic-redOrange-80)] rounded-full text-body2 text-[var(--color-semantic-status-cautionary)]"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* 지금 인기 검색어 */}
        <div className="pb-8">
          <p className="text-lg font-medium text-[var(--color-semantic-label-normal)] mb-2">
            지금 인기 검색어
          </p>
          <div className="flex gap-8">
            <ul className="flex-1 flex flex-col gap-3">
              {left.map((keyword, i) => (
                <li key={keyword} className="flex items-center gap-3">
                  <span className="text-body2 font-bold text-[var(--color-semantic-label-normal)] w-4">
                    {i + 1}
                  </span>
                  <span className="text-body2 font-medium text-[var(--color-semantic-label-normal)]">
                    {keyword}
                  </span>
                </li>
              ))}
            </ul>
            <ul className="flex-1 flex flex-col gap-3">
              {right.map((keyword, i) => (
                <li key={keyword} className="flex items-center gap-3">
                  <span className="text-body2 font-bold text-[var(--color-semantic-label-normal)] w-4">
                    {i + 6}
                  </span>
                  <span className="text-body2 font-medium text-[var(--color-semantic-label-normal)]">
                    {keyword}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 음식 카테고리 */}
        <div className="pb-4">
          <p className="text-lg font-medium text-[var(--color-semantic-label-normal)] mb-2">
            음식 카테고리
          </p>
          <CategoryList />
        </div>
      </div>
    </div>
  );
}
