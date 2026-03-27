export function BottomSheet({ children, className = '' }) {
  return (
    <div
      className={`shrink-0 bg-white px-4 pt-2 rounded-t-2xl shadow-[0_-4px_8px_rgba(0,0,0,0.06)] [clip-path:inset(-12px_0_0_0)] ${className}`}
    >
      <div className="flex justify-center mb-3">
        <div className="w-12 h-[4px] rounded-full bg-[var(--color-atomic-coolNeutral-95)]" />
      </div>
      {children}
    </div>
  );
}
