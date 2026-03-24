import { useEffect } from 'react';

export function Toast({ message, isVisible, onClose, duration = 2000 }) {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-24 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full bg-[var(--color-semantic-label-normal)] px-4 py-2.5">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="shrink-0"
        >
          <circle cx="10" cy="10" r="10" fill="#4CAF50" />
          <path
            d="M6 10l2.5 2.5L14 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="whitespace-nowrap text-body3 font-medium text-white">
          {message}
        </span>
      </div>
    </div>
  );
}
