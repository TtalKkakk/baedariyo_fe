export function BottomModal({
  isOpen,
  onClose,
  title,
  children,
  showClose = true,
}) {
  return (
    <div
      className={`absolute inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-[var(--color-semantic-line-normal-neutral)]" />
        </div>
        <p className="text-center text-body1 font-bold text-[var(--color-semantic-label-normal)] py-3">
          {title}
        </p>
        <div>{children}</div>
        {showClose && (
          <button
            className="w-full py-4 text-body1 font-medium text-[var(--color-semantic-label-normal)]"
            onClick={onClose}
          >
            닫기
          </button>
        )}
      </div>
    </div>
  );
}
